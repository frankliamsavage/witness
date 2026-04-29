import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type CreatorRow = {
  screen_name: string;
  display_name: string | null;
  tagline: string | null;
  bio: string | null;
  avatar_url: string | null;
};

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("creator_profiles")
    .select("screen_name,display_name,tagline,bio,avatar_url")
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
    }));

  return NextResponse.json({ ok: true, creators });
}
