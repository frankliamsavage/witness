import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getAllSiteSettings } from "@/lib/site-settings";
import { createClient } from "@/lib/supabase/server";
import { formatShippingSummary } from "@/lib/addresses";

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
    phone?: string;
  };
  shippingAddress?: {
    id?: string;
    label?: string;
    recipient_name?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    phone?: string;
  };
};

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const liveEnabled = process.env.NEXT_PUBLIC_ENABLE_LIVE_CHECKOUT !== "false";
  const settings = await getAllSiteSettings();
  const stripePaymentsEnabled = settings.stripe_payments_enabled;
  const ordersEnabled = settings.orders_enabled;
  const maintenanceMode = settings.site_maintenance_mode;

  if (!liveEnabled || !stripeSecretKey || !stripePaymentsEnabled || !ordersEnabled || maintenanceMode) {
    return NextResponse.json(
      { ok: false, error: "Payments are temporarily unavailable. Please check back soon." },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as CheckoutPayload | null;
  const items = body?.items ?? [];
  if (!items.length) {
    return NextResponse.json({ ok: false, error: "Cart is empty." }, { status: 400 });
  }

  const stripe = new Stripe(stripeSecretKey, { apiVersion: "2026-04-22.dahlia" });
  const shipping = body?.shippingAddress;
  if (!shipping?.recipient_name || !shipping.address_line1 || !shipping.city || !shipping.state || !shipping.postal_code || !shipping.country) {
    return NextResponse.json({ ok: false, error: "Shipping address is required." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Authentication required." }, { status: 401 });

  const customerNote = body?.customer
    ? `Name: ${body.customer.name ?? ""}\nEmail: ${body.customer.email ?? ""}\nPhone: ${body.customer.phone ?? ""}\nShip to: ${formatShippingSummary(shipping)}`
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
      metadata: {
        ...(customerNote ? { customer_note: customerNote } : {}),
        user_id: user.id,
        shipping_recipient_name: shipping.recipient_name,
        shipping_address_line1: shipping.address_line1,
        shipping_address_line2: shipping.address_line2 ?? "",
        shipping_city: shipping.city,
        shipping_state: shipping.state,
        shipping_postal_code: shipping.postal_code,
        shipping_country: shipping.country,
        shipping_phone: shipping.phone ?? "",
      },
    });

    await supabase.from("checkout_sessions").insert({
      user_id: user.id,
      stripe_session_id: session.id,
      status: "created",
      payment_status: "pending",
      item_count: items.reduce((sum, item) => sum + Math.max(1, item.quantity), 0),
      amount_total: items.reduce((sum, item) => sum + Math.round(item.price * 100) * Math.max(1, item.quantity), 0) / 100,
      shipping_recipient_name: shipping.recipient_name,
      shipping_address_line1: shipping.address_line1,
      shipping_address_line2: shipping.address_line2 ?? null,
      shipping_city: shipping.city,
      shipping_state: shipping.state,
      shipping_postal_code: shipping.postal_code,
      shipping_country: shipping.country,
      shipping_phone: shipping.phone ?? null,
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
