export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-16 sm:px-10">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-10">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Legal
          </p>
          <h1 className="text-3xl font-bold text-zinc-50 sm:text-4xl">Terms of Service</h1>
          <p className="mt-3 text-sm text-zinc-300">Effective date: April 26, 2026</p>
        </section>

        <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8">
          <article>
            <h2 className="text-lg font-semibold text-emerald-300">Use of platform</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              By using Witness Project, you agree to use the platform lawfully and respectfully. You are responsible for
              content you upload, including designs and account details.
            </p>
          </article>
          <article>
            <h2 className="text-lg font-semibold text-emerald-300">Creator submissions</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              Submitting a design does not guarantee acceptance, publication, or payment. Any royalty or buyout terms
              apply only after explicit agreement between Witness Project and the creator.
            </p>
          </article>
          <article>
            <h2 className="text-lg font-semibold text-emerald-300">Purchases and pricing</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              Prices and product availability may change at any time. Checkout UI may be shown before payment processing
              is fully enabled.
            </p>
          </article>
          <article>
            <h2 className="text-lg font-semibold text-emerald-300">Account access</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              You are responsible for maintaining account security. Witness Project may suspend or remove accounts that
              violate platform rules or applicable law.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
