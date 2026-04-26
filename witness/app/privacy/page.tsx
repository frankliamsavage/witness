export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-16 sm:px-10">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-10">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Legal
          </p>
          <h1 className="text-3xl font-bold text-zinc-50 sm:text-4xl">Privacy Policy</h1>
          <p className="mt-3 text-sm text-zinc-300">Effective date: April 26, 2026</p>
        </section>

        <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8">
          <article>
            <h2 className="text-lg font-semibold text-emerald-300">What we collect</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              We collect account details (such as email and screen name), submission content, and activity data needed to
              operate Witness Project.
            </p>
          </article>
          <article>
            <h2 className="text-lg font-semibold text-emerald-300">How we use data</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              Data is used to run accounts, review creator submissions, support users, and improve platform reliability
              and transparency.
            </p>
          </article>
          <article>
            <h2 className="text-lg font-semibold text-emerald-300">Data sharing</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              We do not sell personal data. We may share data with service providers strictly to run core features (for
              example authentication and hosting).
            </p>
          </article>
          <article>
            <h2 className="text-lg font-semibold text-emerald-300">Your choices</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              You can request account updates or deletion by contacting WitnessProject.net@gmail.com.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
