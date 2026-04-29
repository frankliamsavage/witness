import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type UserMeta = { role?: string };

function isAdmin(role: string | undefined) {
  return role?.toLowerCase() === "admin";
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ ok: false, error: "Authentication required." }, { status: 401 });
  const meta = (user.user_metadata ?? {}) as UserMeta;
  if (!isAdmin(meta.role)) return NextResponse.json({ ok: false, error: "Admin access required." }, { status: 403 });

  const url = new URL(request.url);
  const search = url.searchParams.get("search") ?? "";
  const status = url.searchParams.get("status") ?? "";
  const role = url.searchParams.get("role") ?? "";

  const { data, error } = await supabase.rpc("admin_list_users", {
    p_search: search,
    p_status: status,
    p_role: role,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const users = ((data ?? []) as Array<Record<string, unknown>>).map((row) => ({
    ...row,
    total_spent: typeof row.total_spent === "number" ? row.total_spent : 0,
  }));

  return NextResponse.json({ ok: true, users });
}
