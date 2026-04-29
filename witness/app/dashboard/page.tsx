import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SupabaseMissingConfigNotice } from "@/components/SupabaseMissingConfigNotice";
import { isPayoutLegalReviewApproved } from "@/lib/runtime-flags";
import { getAllSiteSettings } from "@/lib/site-settings";
import { createClient } from "@/lib/supabase/server";
import { getSupabasePublicConfig } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Creator dashboard for submissions, royalty tiers, and account tools.",
};

type UserMeta = {
  screen_name?: string;
  full_name?: string;
  role?: string;
  total_sales?: number | string;
  total_revenue?: number | string;
};

type RevenueRoyaltyTier = {
  name: string;
  ratePercent: number;
  minRevenue: number;
  maxRevenue: number | null;
};

const REVENUE_ROYALTY_TIERS: RevenueRoyaltyTier[] = [
  { name: "Launch", ratePercent: 10, minRevenue: 0, maxRevenue: 1000 },
  { name: "Growth", ratePercent: 15, minRevenue: 1000, maxRevenue: 6000 },
  { name: "Scale", ratePercent: 20, minRevenue: 6000, maxRevenue: 12000 },
  { name: "Pro", ratePercent: 25, minRevenue: 12000, maxRevenue: 100000 },
  { name: "Elite", ratePercent: 30, minRevenue: 100000, maxRevenue: null },
];

function parseMoney(value: number | string | undefined): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function getRevenueRoyaltyTier(totalRevenue: number): RevenueRoyaltyTier {
  for (const tier of REVENUE_ROYALTY_TIERS) {
    const inTier = tier.maxRevenue === null
      ? totalRevenue >= tier.minRevenue
      : totalRevenue >= tier.minRevenue && totalRevenue < tier.maxRevenue;
    if (inTier) return tier;
  }
  return REVENUE_ROYALTY_TIERS[0];
}

function getProgressToNextRevenueTier(totalRevenue: number) {
  const currentIndex = REVENUE_ROYALTY_TIERS.findIndex((tier) =>
    tier.maxRevenue === null
      ? totalRevenue >= tier.minRevenue
      : totalRevenue >= tier.minRevenue && totalRevenue < tier.maxRevenue,
  );
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  const currentTier = REVENUE_ROYALTY_TIERS[safeIndex];
  const nextTier = REVENUE_ROYALTY_TIERS[safeIndex + 1] ?? null;

  if (!nextTier || currentTier.maxRevenue === null) {
    return { nextTier: null, percent: 100, revenueNeeded: 0 };
  }

  const tierRange = currentTier.maxRevenue - currentTier.minRevenue;
  const progressInTier = Math.min(Math.max(totalRevenue - currentTier.minRevenue, 0), tierRange);
  const percent = tierRange > 0 ? (progressInTier / tierRange) * 100 : 0;
  const revenueNeeded = Math.max(0, nextTier.minRevenue - totalRevenue);

  return { nextTier, percent, revenueNeeded };
}

export default async function DashboardPage() {
  const featureSettings = await getAllSiteSettings();
  const payoutsApproved = isPayoutLegalReviewApproved() && featureSettings.creator_payouts_enabled;
  const submissionsEnabled = featureSettings.new_design_submissions_enabled && !featureSettings.site_maintenance_mode;
  if (!getSupabasePublicConfig()) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
          <SupabaseMissingConfigNotice className="p-4 text-amber-100" />
        </main>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const meta = user.user_metadata as UserMeta | null;
  const roleNormalized = String(meta?.role ?? "").toLowerCase();
  const isCreatorRole = roleNormalized === "creator" || roleNormalized === "admin";
  const { count: addressCount } = await supabase
    .from("user_addresses")
    .select("id", { head: true, count: "exact" })
    .eq("user_id", user.id);
  const setupIncomplete = !meta?.full_name || (addressCount ?? 0) < 1;
  if (setupIncomplete) {
    redirect("/account/setup?next=/dashboard");
  }
  const totalRevenue = parseMoney(meta?.total_revenue) || parseMoney(meta?.total_sales);
  const currentTier = getRevenueRoyaltyTier(totalRevenue);
  const progress = getProgressToNextRevenueTier(totalRevenue);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-12">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Dashboard
          </p>
          <h1 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">
            Welcome{meta?.screen_name ? `, ${meta.screen_name}` : ""}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            You are signed in as <span className="text-zinc-100">{user.email}</span>
            {meta?.role ? (
              <>
                {" "}
                · Account type: <span className="text-emerald-300">{meta.role}</span>
              </>
            ) : null}
            . Submissions and royalty tools will connect here as those features go live.
          </p>
          {isCreatorRole && (
            <div className="mt-4 flex flex-wrap gap-3">
              {submissionsEnabled ? (
                <Link
                  href="/submit-design"
                  className="inline-flex rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25"
                >
                  Submit a design
                </Link>
              ) : (
                <span className="inline-flex rounded-xl border border-zinc-700 bg-zinc-900/70 px-4 py-2 text-sm font-semibold text-zinc-500">
                  Submissions unavailable
                </span>
              )}
              <Link
                href="/submitted-designs"
                className="inline-flex rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
              >
                View submitted designs
              </Link>
              <Link
                href="/profile"
                className="inline-flex rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
              >
                Edit creator profile
              </Link>
            </div>
          )}
        </section>

        {!payoutsApproved && (
          <section className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
            <p className="text-sm font-semibold text-amber-200">Creator payouts are currently disabled.</p>
            <p className="mt-1 text-xs text-amber-100">
              Payout execution is locked until legal review and payout settings are enabled.
            </p>
          </section>
        )}

        <section className="grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-lg font-semibold text-emerald-300">Submissions</h2>
            <p className="mt-2 text-sm text-zinc-300">Track pending, approved, and rejected design submissions.</p>
            <p className="mt-4">
              {isCreatorRole ? (
                <Link
                  href="/submitted-designs"
                  className="inline-flex rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                >
                  Open submissions
                </Link>
              ) : (
                <span className="inline-flex rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-500">
                  Creator accounts only
                </span>
              )}
            </p>
          </article>
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-lg font-semibold text-emerald-300">Royalty Tier</h2>
            <p className="mt-2 text-sm text-zinc-300">
              Current tier: <span className="font-semibold text-zinc-100">{currentTier.name}</span> (
              {currentTier.ratePercent}%)
            </p>
            <p className="mt-1 text-sm text-zinc-300">
              Total gross revenue: <span className="font-semibold text-zinc-100">${totalRevenue.toFixed(2)}</span>
            </p>
            {progress.nextTier ? (
              <>
                <p className="mt-3 text-xs uppercase tracking-wide text-zinc-400">
                  Progress to {progress.nextTier.ratePercent}% ({progress.nextTier.name})
                </p>
                <div className="mt-2 h-2 w-full rounded-full bg-zinc-800">
                  <div
                    className="h-2 rounded-full bg-emerald-500/80"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-zinc-300">
                  ${progress.revenueNeeded.toFixed(2)} more revenue to unlock the next tier.
                </p>
              </>
            ) : (
              <p className="mt-3 text-xs text-emerald-300">
                You are in the top tier at 30%. Keep pushing momentum.
              </p>
            )}
          </article>
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-lg font-semibold text-emerald-300">{isCreatorRole ? "Profile & Agreements" : "Account Tools"}</h2>
            <p className="mt-2 text-sm text-zinc-300">
              {isCreatorRole
                ? "Manage creator profile, shipping details, contract type, and payment preferences."
                : "Manage shipping details and account resources."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {isCreatorRole && (
                <Link
                  href="/profile"
                  className="inline-flex rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                >
                  Profile
                </Link>
              )}
              <Link
                href="/account/addresses"
                className="inline-flex rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
              >
                Address Book
              </Link>
              {isCreatorRole && (
                <Link
                  href="/agreements"
                  className="inline-flex rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                >
                  Agreements
                </Link>
              )}
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
          <h2 className="text-lg font-semibold text-emerald-300">Royalty Tiers</h2>
          <p className="mt-2 text-sm text-zinc-300">
            Your royalty rate starts at 10% and increases as your total gross revenue grows.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {REVENUE_ROYALTY_TIERS.map((tier) => (
              <div key={tier.name} className="rounded-lg border border-zinc-700 bg-zinc-950/70 p-3">
                <p className="text-xs uppercase tracking-wide text-zinc-400">{tier.name}</p>
                <p className="mt-1 text-lg font-bold text-emerald-300">{tier.ratePercent}%</p>
                <p className="mt-1 text-xs text-zinc-300">
                  {tier.maxRevenue === null
                    ? `$${tier.minRevenue.toLocaleString()}+ revenue`
                    : `$${tier.minRevenue.toLocaleString()} - $${tier.maxRevenue.toLocaleString()} revenue`}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
