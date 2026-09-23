import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      console.error("❌ No orderId in session metadata");
      return NextResponse.json({ error: "No orderId in metadata" }, { status: 400 });
    }

    try {
      // Idempotency: check if order already PAID
      const order = await db.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { product: true } } },
      });

      if (!order) {
        console.error(`❌ Order ${orderId} not found`);
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      if (order.status === "PAID") {
        console.log(`ℹ️ Order ${orderId} already PAID, skipping`);
        return NextResponse.json({ received: true, skipped: true });
      }

      // Begin transaction: mark as PAID + deduct stock
      await db.$transaction(async (tx) => {
        const guestEmail = !order.userId && session.customer_details?.email ? session.customer_details.email : null;

        // Update order status
        await tx.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            stripeSessionId: session.id,
            ...(guestEmail ? { guestEmail } : {}),
          },
        });

        // Deduct stock for each item
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
      });

      console.log(`✅ Order ${orderId} marked as PAID. Stock updated.`);
    } catch (err) {
      console.error(`❌ Error processing order ${orderId}:`, err);
      return NextResponse.json({ error: "Processing failed" }, { status: 500 });
    }
  }

  // Handle payment failure
  if (event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      await db.order.update({
        where: { id: orderId },
        data: { status: "CANCELED" },
      });
      console.log(`❌ Order ${orderId} CANCELED due to payment failure`);
    }
  }

  return NextResponse.json({ received: true });
}
