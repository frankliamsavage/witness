import Link from "next/link";

const REVENUE_ROYALTY_TIERS = [
  { name: "Launch", ratePercent: 10, range: "$0 - $1,000" },
  { name: "Growth", ratePercent: 15, range: "$1,000 - $6,000" },
  { name: "Scale", ratePercent: 20, range: "$6,000 - $12,000" },
  { name: "Pro", ratePercent: 25, range: "$12,000 - $100,000" },
  { name: "Elite", ratePercent: 30, range: "$100,000+" },
];

export default function AgreementsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-12">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Creator Contracts
          </p>
          <h1 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">Profile & Agreements</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            Compare royalty and one-time options so every design has clear terms before launch.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-xl font-semibold text-emerald-300">Royalty agreement</h2>
            <p className="mt-2 text-sm text-zinc-300">
              Earn recurring payouts tied to product performance, with automatic progressive tier upgrades as revenue
              grows.
            </p>
            <div className="mt-4 grid gap-2">
              {REVENUE_ROYALTY_TIERS.map((tier) => (
                <div key={tier.name} className="rounded-lg border border-zinc-700 bg-zinc-950/70 p-3">
                  <p className="text-sm font-semibold text-zinc-100">
                    {tier.ratePercent}% · {tier.name}
                  </p>
                  <p className="mt-1 text-xs text-zinc-300">{tier.range} gross revenue</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-zinc-400">
              Progressive means each rate applies only to revenue earned inside that tier range.
            </p>
          </article>

          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-xl font-semibold text-emerald-300">One-time purchase</h2>
            <p className="mt-2 text-sm text-zinc-300">
              Receive a negotiated upfront payment when Witness buys design rights for direct use.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              <li className="rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 py-2">
                Fixed payout amount agreed before release
              </li>
              <li className="rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 py-2">
                No ongoing royalties after transfer
              </li>
              <li className="rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 py-2">
                Useful when you prefer guaranteed immediate cash
              </li>
            </ul>
          </article>
        </section>

        <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
          <p className="text-sm font-semibold text-emerald-300">Navigation</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link
              href="/profile"
              className="inline-flex rounded-lg border border-emerald-500/40 bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition-colors hover:bg-emerald-500/30"
            >
              Go to profile builder
            </Link>
            <Link
              href="/submitted-designs"
              className="inline-flex rounded-lg border border-zinc-700 bg-zinc-900/80 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
            >
              View submitted designs
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex rounded-lg border border-zinc-700 bg-zinc-900/80 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
            >
              Back to dashboard
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
