export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16 sm:px-10 lg:px-16">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-12">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Witness
          </p>
          <h1 className="max-w-4xl text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl lg:text-5xl">
            Welcome to Witness - A Social Experiment in Transparent Capitalism
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
            Reimagine what a fair economic system can look like when data is open, decisions are collective, and outcomes are built for everyone.
          </p>
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
