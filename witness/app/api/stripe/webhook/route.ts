import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

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
      const session = event.data.object;
      const supabase = await createClient();
      await supabase
        .from("checkout_sessions")
        .update({
          status: "completed",
          payment_status: "paid",
          amount_total: typeof session.amount_total === "number" ? session.amount_total / 100 : null,
        })
        .eq("stripe_session_id", session.id);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Invalid webhook event." },
      { status: 400 },
    );
  }
}
