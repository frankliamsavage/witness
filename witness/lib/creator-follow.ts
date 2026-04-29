export type FollowPlatform =
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

export type FollowLinks = Record<FollowPlatform, string>;

export const PLATFORM_LABELS: Record<FollowPlatform, string> = {
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

export const PLATFORM_HELPERS: Partial<Record<FollowPlatform, string>> = {
  youtube: "Channel URL or @handle",
  tiktok: "@handle or handle",
  twitch: "Handle or full URL",
  instagram: "@handle or handle",
  facebook: "Page URL or username",
  x: "@handle or handle",
  discord: "Invite code or full URL",
  website: "https://your-site.com",
};

export const EMPTY_FOLLOW_LINKS: FollowLinks = {
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

export function normalizeFollowUrl(platform: FollowPlatform, value: string) {
  const trimmed = value.trim();
  if (!trimmed) return { value: "", error: null as string | null };
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

export function normalizeFollowLinks(input: Partial<FollowLinks>) {
  const links: FollowLinks = { ...EMPTY_FOLLOW_LINKS };
  const errors: Partial<Record<FollowPlatform, string>> = {};
  for (const platform of Object.keys(PLATFORM_LABELS) as FollowPlatform[]) {
    const normalized = normalizeFollowUrl(platform, String(input[platform] ?? ""));
    links[platform] = normalized.value;
    if (normalized.error) errors[platform] = normalized.error;
  }
  return { links, errors };
}
