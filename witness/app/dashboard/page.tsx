export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-12">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Dashboard Preview
          </p>
          <h1 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">Creator Dashboard (Coming Soon)</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            This will be where users track submissions, moderation status, and royalty performance once account and auth systems are live.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-lg font-semibold text-emerald-300">Submissions</h2>
            <p className="mt-2 text-sm text-zinc-300">Track pending, approved, and rejected design submissions.</p>
          </article>
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-lg font-semibold text-emerald-300">Royalty Tracking</h2>
            <p className="mt-2 text-sm text-zinc-300">View unit sales, payout totals, and royalty percentages.</p>
          </article>
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-lg font-semibold text-emerald-300">Profile & Agreements</h2>
            <p className="mt-2 text-sm text-zinc-300">Manage creator profile, contract type, and payment preferences.</p>
          </article>
        </section>
      </main>
    </div>
  );
}
