import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-10 sm:gap-16 sm:px-8 sm:py-16 lg:px-16">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6 shadow-2xl shadow-emerald-500/10 sm:p-12">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Witness
          </p>
          <h1 className="max-w-4xl text-2xl font-bold leading-tight text-zinc-50 sm:text-4xl lg:text-5xl">
            Welcome to Witness - A Social Experiment in Transparent Capitalism
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-300 sm:mt-5 sm:text-lg sm:leading-7">
            Reimagine what a fair economic system can look like when data is open, decisions are collective, and outcomes are built for everyone.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap">
            <Link
              href="/products"
              className="mobile-touch-target inline-flex items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/20 px-5 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/30"
            >
              Browse Designs
            </Link>
            <Link
              href="/how-it-works"
              className="mobile-touch-target inline-flex items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-5 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25"
            >
              How Pricing Works
            </Link>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 transition-colors hover:border-emerald-500/50">
            <h2 className="text-xl font-semibold text-emerald-300">Full Transparency</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Every process, decision, and result is visible. Witness is designed so trust comes from open systems, not hidden rules.
            </p>
          </article>

          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 transition-colors hover:border-emerald-500/50">
            <h2 className="text-xl font-semibold text-emerald-300">Community Driven</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              The direction of the platform is shaped by participation. People contribute ideas, vote on priorities, and help steer outcomes.
            </p>
          </article>

          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 transition-colors hover:border-emerald-500/50">
            <h2 className="text-xl font-semibold text-emerald-300">Fair for Everyone</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Opportunity and reward are distributed with intention. The experiment focuses on equitable access, balanced incentives, and shared progress.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
