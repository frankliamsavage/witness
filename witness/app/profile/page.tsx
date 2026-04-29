"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type FollowPlatform =
  | "youtube"
  | "tiktok"
  | "twitch"
  | "instagram"
  | "facebook"
  | "x"
  | "discord"
  | "website"
  | "kick"
  | "threads"
  | "patreon";

type FollowLinks = Record<FollowPlatform, string>;

const PLATFORM_LABELS: Record<FollowPlatform, string> = {
  youtube: "YouTube",
  tiktok: "TikTok",
  twitch: "Twitch",
  instagram: "Instagram",
  facebook: "Facebook",
  x: "X / Twitter",
  discord: "Discord",
  website: "Website",
  kick: "Kick",
  threads: "Threads",
  patreon: "Patreon",
};

const PLATFORM_HELPERS: Partial<Record<FollowPlatform, string>> = {
  youtube: "Channel URL or @handle",
  tiktok: "@handle or handle",
  twitch: "Handle or full URL",
  instagram: "@handle or handle",
  facebook: "Page URL or username",
  x: "@handle or handle",
  discord: "Invite code or full URL",
  website: "https://your-site.com",
};

const EMPTY_FOLLOW_LINKS: FollowLinks = {
  youtube: "",
  tiktok: "",
  twitch: "",
  instagram: "",
  facebook: "",
  x: "",
  discord: "",
  website: "",
  kick: "",
  threads: "",
  patreon: "",
};

function asHttpUrl(value: string) {
  try {
    const parsed = new URL(value);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") return parsed.toString();
    return null;
  } catch {
    return null;
  }
}

function normalizeHandle(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.replace(/^@+/, "");
}

function normalizeFollowUrl(platform: FollowPlatform, value: string) {
  const trimmed = value.trim();
  if (!trimmed) return { value: "", error: null };
  const hasProtocol = /^https?:\/\//i.test(trimmed);

  if (platform === "website") {
    if (!hasProtocol) return { value: "", error: "Website must start with http:// or https://." };
    const valid = asHttpUrl(trimmed);
    return valid ? { value: valid, error: null } : { value: "", error: "Enter a valid website URL." };
  }

  if (hasProtocol) {
    const valid = asHttpUrl(trimmed);
    return valid ? { value: valid, error: null } : { value: "", error: `Enter a valid ${PLATFORM_LABELS[platform]} URL.` };
  }

  const handle = normalizeHandle(trimmed);
  if (!handle) return { value: "", error: null };

  const normalized: Record<Exclude<FollowPlatform, "website">, string> = {
    youtube: handle.startsWith("channel/") || handle.startsWith("c/") ? `https://youtube.com/${handle}` : `https://youtube.com/@${handle}`,
    tiktok: `https://tiktok.com/@${handle}`,
    twitch: `https://twitch.tv/${handle}`,
    instagram: `https://instagram.com/${handle}`,
    facebook: `https://facebook.com/${handle}`,
    x: `https://x.com/${handle}`,
    discord: `https://discord.gg/${handle}`,
    kick: `https://kick.com/${handle}`,
    threads: `https://threads.net/@${handle}`,
    patreon: `https://patreon.com/${handle}`,
  };
  return { value: normalized[platform as Exclude<FollowPlatform, "website">], error: null };
}

const STORAGE_KEY = "witness.creator.profile.draft";

export default function ProfilePage() {
  const [visualsOpen, setVisualsOpen] = useState(true);
  const [bioOpen, setBioOpen] = useState(false);
  const [linksOpen, setLinksOpen] = useState(false);

  const [displayName, setDisplayName] = useState("FrankSavage");
  const [tagline, setTagline] = useState("No secrets. Just values.");
  const [bio, setBio] = useState("");
  const [mission, setMission] = useState("");

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  const [followLinks, setFollowLinks] = useState<FollowLinks>(EMPTY_FOLLOW_LINKS);
  const [followErrors, setFollowErrors] = useState<Partial<Record<FollowPlatform, string>>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as {
        displayName: string;
        tagline: string;
        bio: string;
        mission: string;
        followLinks: FollowLinks;
      };
      setDisplayName(parsed.displayName ?? "FrankSavage");
      setTagline(parsed.tagline ?? "");
      setBio(parsed.bio ?? "");
      setMission(parsed.mission ?? "");
      setFollowLinks(parsed.followLinks ? { ...EMPTY_FOLLOW_LINKS, ...parsed.followLinks } : EMPTY_FOLLOW_LINKS);
    } catch {
      // Keep defaults if local draft is malformed.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: (value: string | null) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
  };

  const saveDraft = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        displayName,
        tagline,
        bio,
        mission,
        followLinks,
      }),
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const normalizedFollowEntries = (Object.keys(PLATFORM_LABELS) as FollowPlatform[])
    .map((platform) => {
      const normalized = normalizeFollowUrl(platform, followLinks[platform]);
      return { platform, ...normalized };
    })
    .filter((entry) => entry.value);

  const saveWithValidation = () => {
    const nextErrors: Partial<Record<FollowPlatform, string>> = {};
    const nextLinks: FollowLinks = { ...followLinks };
    for (const platform of Object.keys(PLATFORM_LABELS) as FollowPlatform[]) {
      const normalized = normalizeFollowUrl(platform, followLinks[platform]);
      if (normalized.error) nextErrors[platform] = normalized.error;
      nextLinks[platform] = normalized.value;
    }
    setFollowErrors(nextErrors);
    setFollowLinks(nextLinks);
    if (Object.keys(nextErrors).length) return;
    saveDraft();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-12">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Creator Identity
          </p>
          <h1 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">Profile Builder</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            Build a distinct IP page for your brand. Customize visual style, introduce your story, and make your creator space feel original.
          </p>
          <div className="mt-6 rounded-xl border border-zinc-700 bg-zinc-950/80 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-400">Live preview</p>
            <p className="mt-1 text-xl font-bold text-zinc-100">{displayName || "Your creator name"}</p>
            <p className="mt-1 text-sm text-emerald-300">{tagline || "Your tagline appears here"}</p>
            {normalizedFollowEntries.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Follow This Creator</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {normalizedFollowEntries.map((entry) => (
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
          </div>
        </section>

        <section className="grid gap-6">
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-emerald-300">Brand visuals</h2>
              <button
                onClick={() => setVisualsOpen((v) => !v)}
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
              >
                {visualsOpen ? "Hide" : "Edit visuals"}
              </button>
            </div>
            <p className="mt-2 text-sm text-zinc-300">
              Upload a profile image, banner, and custom background to make your IP page instantly recognizable.
            </p>
            {visualsOpen && (
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <label className="grid gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Profile image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onImageSelect(e, setProfileImage)}
                    className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-500/20 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-emerald-300"
                  />
                  <div className="h-24 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-950/80">
                    {profileImage ? <img src={profileImage} alt="Profile preview" className="h-full w-full object-cover" /> : null}
                  </div>
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Banner image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onImageSelect(e, setBannerImage)}
                    className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-500/20 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-emerald-300"
                  />
                  <div className="h-24 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-950/80">
                    {bannerImage ? <img src={bannerImage} alt="Banner preview" className="h-full w-full object-cover" /> : null}
                  </div>
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Background image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onImageSelect(e, setBackgroundImage)}
                    className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-500/20 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-emerald-300"
                  />
                  <div className="h-24 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-950/80">
                    {backgroundImage ? (
                      <img src={backgroundImage} alt="Background preview" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                </label>
              </div>
            )}
          </article>

          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-emerald-300">Creator bio</h2>
              <button
                onClick={() => setBioOpen((v) => !v)}
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
              >
                {bioOpen ? "Hide" : "Edit bio"}
              </button>
            </div>
            <p className="mt-2 text-sm text-zinc-300">
              Add your mission, influences, and the story behind your designs so fans understand your brand.
            </p>
            {bioOpen && (
              <div className="mt-4 grid gap-3">
                <label className="grid gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Display name</span>
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                    placeholder="FrankSavage"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Tagline</span>
                  <input
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                    placeholder="No secrets. Just values."
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Bio</span>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                    placeholder="Tell your story."
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Mission</span>
                  <textarea
                    rows={3}
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                    placeholder="What your brand stands for."
                  />
                </label>
              </div>
            )}
          </article>

          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-emerald-300">Follow This Creator</h2>
              <button
                onClick={() => setLinksOpen((v) => !v)}
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
              >
                {linksOpen ? "Hide" : "Manage links"}
              </button>
            </div>
            <p className="mt-2 text-sm text-zinc-300">
              Add the places fans can follow you outside Witness.
            </p>
            {linksOpen && (
              <div className="mt-4 grid gap-3">
                {(Object.keys(PLATFORM_LABELS) as FollowPlatform[]).map((platform) => (
                  <div key={platform} className="grid gap-2 sm:grid-cols-[140px_1fr]">
                    <span className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      {PLATFORM_LABELS[platform]}
                    </span>
                    <div className="grid gap-1">
                      <input
                        value={followLinks[platform]}
                        onChange={(e) =>
                          setFollowLinks((prev) => ({
                            ...prev,
                            [platform]: e.target.value,
                          }))
                        }
                        onBlur={() => {
                          const normalized = normalizeFollowUrl(platform, followLinks[platform]);
                          setFollowLinks((prev) => ({ ...prev, [platform]: normalized.value }));
                          setFollowErrors((prev) => ({ ...prev, [platform]: normalized.error ?? "" }));
                        }}
                        className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                        placeholder={PLATFORM_HELPERS[platform] ?? "Optional"}
                      />
                      {followErrors[platform] ? (
                        <p className="text-xs text-red-300">{followErrors[platform]}</p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        </section>

        <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
          <p className="text-sm font-semibold text-emerald-300">Save profile draft</p>
          <p className="mt-2 text-sm text-zinc-100">
            Save your current profile details in this browser while backend storage wiring is completed.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={saveWithValidation}
              className="inline-flex rounded-lg border border-emerald-500/40 bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition-colors hover:bg-emerald-500/30"
            >
              Save draft
            </button>
            <Link
              href="/agreements"
              className="inline-flex rounded-lg border border-zinc-700 bg-zinc-900/80 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
            >
              Open agreements
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex rounded-lg border border-zinc-700 bg-zinc-900/80 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
            >
              Back to dashboard
            </Link>
          </div>
          {saved && <p className="mt-3 text-xs font-semibold text-emerald-300">Draft saved.</p>}
        </section>
      </main>
    </div>
  );
}
