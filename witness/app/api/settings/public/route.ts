import { NextResponse } from "next/server";
import { getSiteSetting } from "@/lib/site-settings";

export async function GET() {
  const stripePaymentsEnabled = await getSiteSetting("stripe_payments_enabled");
  return NextResponse.json({ ok: true, stripe_payments_enabled: stripePaymentsEnabled });
}
