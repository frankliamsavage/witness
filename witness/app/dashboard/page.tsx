import Link from "next/link";
import { redirect } from "next/navigation";
import { SupabaseMissingConfigNotice } from "@/components/SupabaseMissingConfigNotice";
import { createClient } from "@/lib/supabase/server";
import { getSupabasePublicConfig } from "@/lib/supabase/env";
import { getProgressToNextTier, getRoyaltyTier, ROYALTY_TIERS } from "@/lib/royalty-tiers";

export const dynamic = "force-dynamic";

type UserMeta = { screen_name?: string; role?: string; total_sales?: number | string };

export default async function DashboardPage() {
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
  const totalSalesRaw = meta?.total_sales;
  const totalSales =
    typeof totalSalesRaw === "number"
      ? totalSalesRaw
      : typeof totalSalesRaw === "string"
        ? Number.parseInt(totalSalesRaw, 10) || 0
        : 0;
  const currentTier = getRoyaltyTier(totalSales);
  const progress = getProgressToNextTier(totalSales);

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
          {meta?.role === "Creator" && (
            <p className="mt-4">
              <Link
                href="/submit-design"
                className="inline-flex rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25"
              >
                Submit a design
              </Link>
            </p>
          )}
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-lg font-semibold text-emerald-300">Submissions</h2>
            <p className="mt-2 text-sm text-zinc-300">Track pending, approved, and rejected design submissions.</p>
          </article>
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-lg font-semibold text-emerald-300">Royalty Tier</h2>
            <p className="mt-2 text-sm text-zinc-300">
              Current tier: <span className="font-semibold text-zinc-100">{currentTier.name}</span> (
              {currentTier.ratePercent}%)
            </p>
            <p className="mt-1 text-sm text-zinc-300">
              Total sales: <span className="font-semibold text-zinc-100">{totalSales}</span>
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
                  {progress.salesNeeded} more sale{progress.salesNeeded === 1 ? "" : "s"} to unlock the next tier.
                </p>
              </>
            ) : (
              <p className="mt-3 text-xs text-emerald-300">
                You are in the top tier at 15%. Keep pushing sales momentum.
              </p>
            )}
          </article>
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-lg font-semibold text-emerald-300">Profile & Agreements</h2>
            <p className="mt-2 text-sm text-zinc-300">Manage creator profile, contract type, and payment preferences.</p>
          </article>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
          <h2 className="text-lg font-semibold text-emerald-300">Royalty Tiers</h2>
          <p className="mt-2 text-sm text-zinc-300">
            Your royalty rate starts at 5% and increases as your total sales grow.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {ROYALTY_TIERS.map((tier) => (
              <div key={tier.name} className="rounded-lg border border-zinc-700 bg-zinc-950/70 p-3">
                <p className="text-xs uppercase tracking-wide text-zinc-400">{tier.name}</p>
                <p className="mt-1 text-lg font-bold text-emerald-300">{tier.ratePercent}%</p>
                <p className="mt-1 text-xs text-zinc-300">
                  {tier.maxSales === null
                    ? `${tier.minSales}+ total sales`
                    : `${tier.minSales}-${tier.maxSales} total sales`}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
