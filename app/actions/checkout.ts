"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { checkoutSchema } from "@/lib/validations";

interface CartItem {
  productId: string;
  quantity: number;
}

interface CheckoutResult {
  url?: string;
  error?: string;
}

export async function createCheckoutSession(
  cartItems: CartItem[]
): Promise<CheckoutResult> {
  // 1. Authenticate user (optional for guest checkout)
  const { userId } = await auth();
  let userEmail = undefined;
  
  if (userId) {
    const user = await currentUser();
    userEmail = user?.emailAddresses[0]?.emailAddress;
  }
  // 2. Validate input
  const validation = checkoutSchema.safeParse({ items: cartItems });
  if (!validation.success) {
    return { error: "Dados do carrinho inválidos." };
  }

  // 3. Fetch products from DB (NEVER trust client prices)
  const productIds = cartItems.map((i) => i.productId);
  const products = await db.product.findMany({
    where: {
      id: { in: productIds },
      active: true,
    },
  });

  // 4. Validate all products exist and have stock
  const lineItems = [];
  const orderItems = [];
  let totalInCents = 0;

  for (const cartItem of cartItems) {
    const product = products.find((p) => p.id === cartItem.productId);
    if (!product) {
      return { error: `Produto não encontrado ou indisponível.` };
    }
    if (product.stock < cartItem.quantity) {
      return {
        error: `Produto "${product.name}" não tem estoque suficiente. Disponível: ${product.stock}.`,
      };
    }

    const itemTotal = product.priceInCents * cartItem.quantity;
    totalInCents += itemTotal;

    lineItems.push({
      price_data: {
        currency: "brl",
        product_data: {
          name: product.name,
          images: product.images.slice(0, 1),
          description: product.description.slice(0, 255),
        },
        unit_amount: product.priceInCents,
      },
      quantity: cartItem.quantity,
    });

    orderItems.push({
      productId: product.id,
      quantity: cartItem.quantity,
      priceInCentsAtPurchase: product.priceInCents,
    });
  }

  // 5. Create Order with PENDING status BEFORE redirecting to Stripe
  const order = await db.order.create({
    data: {
      ...(userId ? { userId } : {}),
      status: "PENDING",
      totalInCents,
      items: {
        create: orderItems,
      },
    },
  });

  // 6. Create Stripe Checkout Session
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${baseUrl}/pedido/confirmado?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/carrinho`,
    metadata: {
      orderId: order.id,
    },
    locale: "pt-BR",
    billing_address_collection: "required",
    shipping_address_collection: {
      allowed_countries: ["BR"],
    },
    customer_email: userEmail, // Will prompt if undefined (guest)
  });

  // 7. Update order with Stripe session ID
  await db.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  if (!session.url) {
    return { error: "Erro ao criar sessão de pagamento. Tente novamente." };
  }

  return { url: session.url };
}
