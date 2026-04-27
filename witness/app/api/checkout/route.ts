import { NextResponse } from "next/server";
import Stripe from "stripe";

type CheckoutItem = {
  name: string;
  quantity: number;
  price: number;
};

type CheckoutPayload = {
  items?: CheckoutItem[];
  customer?: {
    name?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
};

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const liveEnabled = process.env.NEXT_PUBLIC_ENABLE_LIVE_CHECKOUT !== "false";

  if (!liveEnabled || !stripeSecretKey) {
    return NextResponse.json(
      { ok: false, error: "Live checkout is not enabled or Stripe key is missing." },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as CheckoutPayload | null;
  const items = body?.items ?? [];
  if (!items.length) {
    return NextResponse.json({ ok: false, error: "Cart is empty." }, { status: 400 });
  }

  const stripe = new Stripe(stripeSecretKey, { apiVersion: "2026-04-22.dahlia" });
  const customerNote = body?.customer
    ? `Name: ${body.customer.name ?? ""}\nEmail: ${body.customer.email ?? ""}\nAddress: ${body.customer.address ?? ""}, ${body.customer.city ?? ""}, ${body.customer.state ?? ""} ${body.customer.zip ?? ""}`
    : undefined;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${siteUrl}/checkout?status=paid`,
      cancel_url: `${siteUrl}/checkout?status=cancelled`,
      line_items: items.map((item) => ({
        quantity: Math.max(1, item.quantity),
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
      })),
      customer_email: body?.customer?.email,
      metadata: customerNote ? { customer_note: customerNote } : undefined,
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to create Stripe session.",
      },
      { status: 500 },
    );
  }
}
