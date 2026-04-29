import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type CreatorRow = {
  screen_name: string;
  display_name: string | null;
  tagline: string | null;
  bio: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  background_url: string | null;
  follow_links: Record<string, string> | null;
  created_at: string | null;
};

export async function GET() {
  const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;
  const nowMs = Date.now();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("creator_profiles")
    .select("screen_name,display_name,tagline,bio,avatar_url,banner_url,background_url,follow_links,created_at")
    .order("display_name", { ascending: true });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const creators = ((data ?? []) as CreatorRow[])
    .filter((row) => Boolean(row.screen_name))
    .map((row) => ({
      screenName: row.screen_name,
      displayName: row.display_name || row.screen_name,
      tagline: row.tagline || "",
      bio: row.bio || "",
      avatarUrl: row.avatar_url || "",
      bannerUrl: row.banner_url || "",
      backgroundUrl: row.background_url || "",
      followLinks: row.follow_links ?? {},
      createdAt: row.created_at ?? null,
      isNew:
        typeof row.created_at === "string" &&
        nowMs - new Date(row.created_at).getTime() <= ninetyDaysMs,
    }));

  return NextResponse.json({ ok: true, creators });
}
