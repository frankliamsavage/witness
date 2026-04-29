import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type UserMeta = { role?: string };
type ShippingAddress = {
  recipient_name: string | null;
  line1: string | null;
  line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  phone_number: string | null;
};
type PurchaseRow = {
  order_id: string;
  order_number: string;
  order_date: string | null;
  order_status: string;
  payment_status: string;
  item_count: number;
  order_total: number;
  shipping_summary: string | null;
};

function isAdmin(role: string | undefined) {
  return role?.toLowerCase() === "admin";
}

function isMissingFunctionError(message: string | undefined) {
  return Boolean(message && message.toLowerCase().includes("could not find the function"));
}

export async function GET(_: Request, context: { params: Promise<{ userId: string }> }) {
  const { userId } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ ok: false, error: "Authentication required." }, { status: 401 });
  const meta = (user.user_metadata ?? {}) as UserMeta;
  if (!isAdmin(meta.role)) return NextResponse.json({ ok: false, error: "Admin access required." }, { status: 403 });

  const { data, error } = await supabase.rpc("admin_get_user_detail", { p_target_user_id: userId });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  const detail = (Array.isArray(data) ? data[0] : null) as
    | (Record<string, unknown> & {
        email?: string | null;
        display_name?: string | null;
      })
    | null;
  if (!detail) {
    return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });
  }

  const shippingFallback: ShippingAddress = {
    recipient_name: null,
    line1: null,
    line2: null,
    city: null,
    state: null,
    postal_code: null,
    country: null,
    phone_number: null,
  };
  const purchasesFallback: PurchaseRow[] = [];

  const [shippingResult, purchasesResult] = await Promise.all([
    supabase.rpc("admin_get_user_shipping_address", { p_target_user_id: userId }),
    supabase.rpc("admin_get_user_purchases", { p_target_user_id: userId, p_limit: 20 }),
  ]);

  let shipping = shippingFallback;
  if (!shippingResult.error) {
    const shippingData = Array.isArray(shippingResult.data) ? shippingResult.data[0] : shippingResult.data;
    if (shippingData) {
      shipping = {
        recipient_name: (shippingData as ShippingAddress).recipient_name ?? null,
        line1: (shippingData as ShippingAddress).line1 ?? null,
        line2: (shippingData as ShippingAddress).line2 ?? null,
        city: (shippingData as ShippingAddress).city ?? null,
        state: (shippingData as ShippingAddress).state ?? null,
        postal_code: (shippingData as ShippingAddress).postal_code ?? null,
        country: (shippingData as ShippingAddress).country ?? null,
        phone_number: (shippingData as ShippingAddress).phone_number ?? null,
      };
    }
  } else if (!isMissingFunctionError(shippingResult.error.message)) {
    return NextResponse.json({ ok: false, error: shippingResult.error.message }, { status: 500 });
  }

  let purchases = purchasesFallback;
  if (!purchasesResult.error) {
    purchases = Array.isArray(purchasesResult.data) ? (purchasesResult.data as PurchaseRow[]) : purchasesFallback;
  } else if (!isMissingFunctionError(purchasesResult.error.message)) {
    return NextResponse.json({ ok: false, error: purchasesResult.error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    user: {
      ...detail,
      total_spent: typeof detail.total_spent === "number" ? detail.total_spent : 0,
      phone_number: typeof detail.phone_number === "string" ? detail.phone_number : null,
      shipping,
      purchases,
    },
  });
}

export async function PATCH(request: Request, context: { params: Promise<{ userId: string }> }) {
  const { userId } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ ok: false, error: "Authentication required." }, { status: 401 });
  const meta = (user.user_metadata ?? {}) as UserMeta;
  if (!isAdmin(meta.role)) return NextResponse.json({ ok: false, error: "Admin access required." }, { status: 403 });

  const body = (await request.json().catch(() => null)) as
    | {
        role?: string;
        status?: "active" | "suspended" | "disabled" | "pending" | "anonymized";
        notes?: string;
        action?: "suspend" | "reactivate" | "disable" | "anonymize" | "delete_data";
        confirmation?: string;
      }
    | null;

  if (body?.action) {
    const { data, error } = await supabase.rpc("admin_apply_dangerous_action", {
      p_target_user_id: userId,
      p_action: body.action,
      p_confirmation: body.confirmation ?? "",
    });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, message: (Array.isArray(data) ? data[0] : data) ?? "Action completed." });
  }

  const nextRole = body?.role;
  const nextStatus = body?.status;
  if (!nextRole || !nextStatus) {
    return NextResponse.json({ ok: false, error: "Role and status are required." }, { status: 400 });
  }

  const { error } = await supabase.rpc("admin_update_user", {
    p_target_user_id: userId,
    p_new_role: nextRole,
    p_new_status: nextStatus,
    p_notes: body?.notes ?? null,
  });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
