import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EMPTY_FOLLOW_LINKS, PLATFORM_LABELS, type FollowLinks, type FollowPlatform } from "@/lib/creator-follow";

type CreatorProfile = {
  screen_name: string;
  display_name: string;
  tagline: string | null;
  bio: string | null;
  mission: string | null;
  follow_links: Partial<FollowLinks> | null;
  avatar_url: string | null;
  banner_url: string | null;
  background_url: string | null;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ screenName: string }>;
}): Promise<Metadata> {
  const { screenName } = await params;
  return {
    title: `${screenName} | Creator Profile`,
    description: `View ${screenName}'s creator portfolio and follow links on Witness.`,
  };
}

export default async function PublicCreatorProfilePage({
  params,
}: {
  params: Promise<{ screenName: string }>;
}) {
  const { screenName } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("creator_profiles")
    .select("screen_name,display_name,tagline,bio,mission,follow_links,avatar_url,banner_url,background_url")
    .eq("screen_name", screenName)
    .maybeSingle();
  if (error) {
    notFound();
  }
  if (!data) {
    notFound();
  }

  const profile = data as CreatorProfile;
  const followLinks = { ...EMPTY_FOLLOW_LINKS, ...(profile.follow_links ?? {}) };
  const followEntries = (Object.keys(PLATFORM_LABELS) as FollowPlatform[])
    .map((platform) => ({ platform, value: String(followLinks[platform] ?? "").trim() }))
    .filter((entry) => entry.value);

  return (
    <div
      className="min-h-screen bg-zinc-950 text-zinc-100"
      style={
        profile.background_url
          ? {
              backgroundImage: `linear-gradient(rgba(9,9,11,0.92), rgba(9,9,11,0.92)), url("${profile.background_url}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
        <section
          className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-12"
          style={
            profile.banner_url
              ? {
                  backgroundImage: `linear-gradient(rgba(24,24,27,0.88), rgba(9,9,11,0.95)), url("${profile.banner_url}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Creator Portfolio
          </p>
          <div className="flex items-start gap-4">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={`${profile.display_name || profile.screen_name} avatar`}
                className="h-16 w-16 rounded-xl border border-zinc-700 object-cover"
              />
            ) : null}
            <div>
              <h1 className="text-3xl font-bold text-zinc-50 sm:text-4xl">{profile.display_name || profile.screen_name}</h1>
              <p className="mt-2 text-sm text-zinc-400">@{profile.screen_name}</p>
            </div>
          </div>
          {profile.tagline ? <p className="mt-3 text-base text-emerald-300">{profile.tagline}</p> : null}

          {followEntries.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Follow This Creator</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {followEntries.map((entry) => (
                  <a
                    key={entry.platform}
                    href={entry.value}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-zinc-700 bg-zinc-900/80 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                  >
                    {PLATFORM_LABELS[entry.platform]}
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-lg font-semibold text-emerald-300">Bio</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-300">{profile.bio || "No bio added yet."}</p>
          </article>
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-lg font-semibold text-emerald-300">Mission</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-300">{profile.mission || "No mission statement added yet."}</p>
          </article>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
            >
              Browse products
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
            >
              How it works
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
