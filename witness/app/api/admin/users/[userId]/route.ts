import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type UserMeta = { role?: string };

function isAdmin(role: string | undefined) {
  return role?.toLowerCase() === "admin";
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
  const detail = Array.isArray(data) ? data[0] : null;
  return NextResponse.json({ ok: true, user: detail });
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
