import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SETTING_KEYS, type SettingKey, getAllSiteSettings, updateSiteSetting } from "@/lib/site-settings";

type UserMeta = {
  role?: string;
};

function isAdmin(role: string | undefined) {
  return role?.toLowerCase() === "admin";
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Authentication required." }, { status: 401 });
  }

  const meta = (user.user_metadata ?? {}) as UserMeta;
  if (!isAdmin(meta.role)) {
    return NextResponse.json({ ok: false, error: "Admin access required." }, { status: 403 });
  }

  const settings = await getAllSiteSettings();
  return NextResponse.json({ ok: true, settings });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Authentication required." }, { status: 401 });
  }

  const meta = (user.user_metadata ?? {}) as UserMeta;
  if (!isAdmin(meta.role)) {
    return NextResponse.json({ ok: false, error: "Admin access required." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as { key?: string; value?: boolean } | null;
  const key = body?.key as SettingKey | undefined;
  const value = body?.value;

  if (!key || !SETTING_KEYS.includes(key) || typeof value !== "boolean") {
    return NextResponse.json({ ok: false, error: "Invalid setting payload." }, { status: 400 });
  }

  try {
    await updateSiteSetting(key, value, user.id);
    console.info("[admin-settings] updated", { key, value, adminUserId: user.id, at: new Date().toISOString() });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to save setting.",
      },
      { status: 500 },
    );
  }
}
