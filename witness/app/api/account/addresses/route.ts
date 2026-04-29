import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { normalizeAddressInput, validateAddressInput, type AddressInput } from "@/lib/addresses";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ ok: false, error: "Authentication required." }, { status: 401 }) };
  return { supabase, user };
}

export async function GET() {
  const ctx = await requireUser();
  if ("error" in ctx) return ctx.error;

  const { supabase, user } = ctx;
  const { data, error } = await supabase
    .from("user_addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, addresses: data ?? [] });
}

export async function POST(request: Request) {
  const ctx = await requireUser();
  if ("error" in ctx) return ctx.error;

  const { supabase, user } = ctx;
  const body = (await request.json().catch(() => null)) as AddressInput | null;
  if (!body) return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });

  const normalized = normalizeAddressInput(body);
  const validationError = validateAddressInput(normalized);
  if (validationError) return NextResponse.json({ ok: false, error: validationError }, { status: 400 });

  const { count, error: countError } = await supabase
    .from("user_addresses")
    .select("id", { head: true, count: "exact" })
    .eq("user_id", user.id);
  if (countError) return NextResponse.json({ ok: false, error: countError.message }, { status: 500 });

  const shouldDefault = normalized.is_default || !count;
  if (shouldDefault) {
    const { error: unsetError } = await supabase
      .from("user_addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);
    if (unsetError) return NextResponse.json({ ok: false, error: unsetError.message }, { status: 500 });
  }

  const payload = {
    user_id: user.id,
    ...normalized,
    is_default: shouldDefault,
  };

  const { data, error } = await supabase.from("user_addresses").insert(payload).select("*").single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  const currentMeta = (user.user_metadata ?? {}) as Record<string, unknown>;
  await supabase.auth.updateUser({
    data: {
      ...currentMeta,
      full_name: currentMeta.full_name ?? normalized.recipient_name,
      phone: currentMeta.phone ?? normalized.phone,
      shipping_address: normalized.address_line1,
      shipping_city: normalized.city,
      shipping_state: normalized.state,
      shipping_zip: normalized.postal_code,
      shipping_country: normalized.country,
      shipping_phone: normalized.phone,
    },
  });

  return NextResponse.json({ ok: true, address: data }, { status: 201 });
}
