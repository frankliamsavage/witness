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

export async function PATCH(request: Request, context: { params: Promise<{ addressId: string }> }) {
  const ctx = await requireUser();
  if ("error" in ctx) return ctx.error;
  const { addressId } = await context.params;
  const { supabase, user } = ctx;

  const body = (await request.json().catch(() => null)) as AddressInput | null;
  if (!body) return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  const normalized = normalizeAddressInput(body);
  const validationError = validateAddressInput(normalized);
  if (validationError) return NextResponse.json({ ok: false, error: validationError }, { status: 400 });

  if (normalized.is_default) {
    const { error: unsetError } = await supabase
      .from("user_addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);
    if (unsetError) return NextResponse.json({ ok: false, error: unsetError.message }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("user_addresses")
    .update(normalized)
    .eq("id", addressId)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, address: data });
}

export async function DELETE(_: Request, context: { params: Promise<{ addressId: string }> }) {
  const ctx = await requireUser();
  if ("error" in ctx) return ctx.error;
  const { addressId } = await context.params;
  const { supabase, user } = ctx;

  const { data: existing, error: existingError } = await supabase
    .from("user_addresses")
    .select("id,is_default")
    .eq("id", addressId)
    .eq("user_id", user.id)
    .single();
  if (existingError) return NextResponse.json({ ok: false, error: existingError.message }, { status: 500 });

  const { error } = await supabase.from("user_addresses").delete().eq("id", addressId).eq("user_id", user.id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  if (existing?.is_default) {
    const { data: replacement } = await supabase
      .from("user_addresses")
      .select("id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (replacement?.id) {
      await supabase.from("user_addresses").update({ is_default: true }).eq("id", replacement.id).eq("user_id", user.id);
    }
  }

  return NextResponse.json({ ok: true });
}
