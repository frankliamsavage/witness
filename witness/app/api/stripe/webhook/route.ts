import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeSecretKey || !webhookSecret) {
    return NextResponse.json({ ok: false, error: "Stripe webhook not configured." }, { status: 503 });
  }

  const stripe = new Stripe(stripeSecretKey, { apiVersion: "2026-04-22.dahlia" });
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ ok: false, error: "Missing Stripe signature." }, { status: 400 });
  }

  const payload = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    if (event.type === "checkout.session.completed") {
      // Hook point: persist paid order and trigger fulfillment.
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Invalid webhook event." },
      { status: 400 },
    );
  }
}
