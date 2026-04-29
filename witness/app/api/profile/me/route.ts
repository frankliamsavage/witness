import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { normalizeFollowLinks, type FollowLinks } from "@/lib/creator-follow";

type ProfilePayload = {
  display_name?: string;
  tagline?: string;
  bio?: string;
  mission?: string;
  follow_links?: Partial<FollowLinks>;
  avatar_url?: string;
  banner_url?: string;
  background_url?: string;
};

function isCreatorRole(role: string | undefined) {
  const normalized = String(role ?? "").toLowerCase();
  return normalized === "creator" || normalized === "admin";
}

function normalizeImageUrl(value: unknown) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  const isHttp = /^https?:\/\//i.test(raw);
  const isDataImage = /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(raw);
  if (!isHttp && !isDataImage) return null;
  if (raw.length > 5_000_000) return null;
  return raw;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Authentication required." }, { status: 401 });

  const role = (user.user_metadata as { role?: string } | null)?.role;
  if (!isCreatorRole(role)) return NextResponse.json({ ok: false, error: "Creator access required." }, { status: 403 });

  const screenName = String((user.user_metadata as { screen_name?: string } | null)?.screen_name ?? "").trim();
  const { data, error } = await supabase.from("creator_profiles").select("*").eq("user_id", user.id).maybeSingle();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({
    ok: true,
    profile: data ?? {
      user_id: user.id,
      screen_name: screenName,
      display_name: screenName,
      tagline: "",
      bio: "",
      mission: "",
      follow_links: {},
      avatar_url: "",
      banner_url: "",
      background_url: "",
    },
  });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Authentication required." }, { status: 401 });

  const role = (user.user_metadata as { role?: string } | null)?.role;
  if (!isCreatorRole(role)) return NextResponse.json({ ok: false, error: "Creator access required." }, { status: 403 });

  const body = (await request.json().catch(() => null)) as ProfilePayload | null;
  if (!body) return NextResponse.json({ ok: false, error: "Invalid payload." }, { status: 400 });
  const { links, errors } = normalizeFollowLinks(body.follow_links ?? {});
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, error: "Invalid follow links.", errors }, { status: 400 });
  }

  const screenName = String((user.user_metadata as { screen_name?: string } | null)?.screen_name ?? "").trim();
  if (!screenName) {
    return NextResponse.json({ ok: false, error: "Missing screen name in account metadata." }, { status: 400 });
  }
  const avatarUrl = normalizeImageUrl(body.avatar_url);
  const bannerUrl = normalizeImageUrl(body.banner_url);
  const backgroundUrl = normalizeImageUrl(body.background_url);
  if (avatarUrl === null || bannerUrl === null || backgroundUrl === null) {
    return NextResponse.json({ ok: false, error: "Invalid image format or image too large." }, { status: 400 });
  }

  const payload = {
    user_id: user.id,
    screen_name: screenName,
    display_name: String(body.display_name ?? screenName).trim() || screenName,
    tagline: String(body.tagline ?? "").trim(),
    bio: String(body.bio ?? "").trim(),
    mission: String(body.mission ?? "").trim(),
    follow_links: links,
    avatar_url: avatarUrl,
    banner_url: bannerUrl,
    background_url: backgroundUrl,
  };

  const { data, error } = await supabase
    .from("creator_profiles")
    .upsert(payload, { onConflict: "user_id" })
    .select("*")
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, profile: data });
}
