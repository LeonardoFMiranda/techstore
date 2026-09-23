"use server";

import { db } from "@/lib/db";
import { z } from "zod";

const trackingSchema = z.object({
  orderId: z.string().min(5, "ID do pedido inválido"),
  email: z.string().email("E-mail inválido"),
});

export async function trackOrder(prevState: any, formData: FormData) {
  const rawOrderId = formData.get("orderId") as string;
  const email = formData.get("email") as string;

  // Clean the orderId (users might paste #1234 or the full cuid)
  // We'll search by the end of the ID since we show .slice(-8) in the UI
  const orderId = rawOrderId.replace(/^#/, "").trim();

  const validation = trackingSchema.safeParse({ orderId, email });
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  // Find order matching ID (endsWith to match short IDs) and email
  // If it's a guest order, guestEmail must match.
  const orders = await db.order.findMany({
    where: {
      id: { endsWith: orderId },
    },
    include: {
      items: {
        include: { product: { select: { name: true, images: true } } },
      },
    },
  });

  if (orders.length === 0) {
    return { error: "Pedido não encontrado com essas informações." };
  }

  // Find the exact order matching the email (guestEmail)
  const matchedOrder = orders.find((o) => {
    // If it's a guest order, compare guestEmail
    if (o.guestEmail && o.guestEmail.toLowerCase() === email.toLowerCase()) {
      return true;
    }
    return false;
  });

  if (!matchedOrder) {
    return { error: "Pedido não encontrado ou o e-mail não corresponde." };
  }

  // Return safe serializable data
  return {
    order: {
      id: matchedOrder.id,
      status: matchedOrder.status,
      createdAt: matchedOrder.createdAt,
      totalInCents: matchedOrder.totalInCents,
      stripeSessionId: matchedOrder.stripeSessionId,
      items: matchedOrder.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        priceInCentsAtPurchase: item.priceInCentsAtPurchase,
        product: {
          name: item.product.name,
          image: item.product.images[0] || null,
        }
      })),
    }
  };
}
