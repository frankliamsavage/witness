export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-16 sm:px-10">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-10">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Legal
          </p>
          <h1 className="text-3xl font-bold text-zinc-50 sm:text-4xl">Witness Project Privacy Policy</h1>
          <p className="mt-3 text-sm text-zinc-300">Last updated: April 26, 2026</p>
          <p className="mt-2 text-sm leading-7 text-zinc-300">We value transparency in everything we do.</p>
        </section>

        <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8">
          <article>
            <h2 className="text-lg font-semibold text-emerald-300">1. Introduction</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">This page explains what data we collect and how we use it.</p>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-emerald-300">2. What We Collect</h2>
            <ul className="mt-2 space-y-1 text-sm leading-7 text-zinc-300">
              <li>Name, email, and shipping address (when you place an order)</li>
              <li>Payment information (processed securely through our payment processor)</li>
              <li>Design submissions (artwork and concepts you send us)</li>
            </ul>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-emerald-300">3. How We Use It</h2>
            <ul className="mt-2 space-y-1 text-sm leading-7 text-zinc-300">
              <li>Process and deliver orders</li>
              <li>Communicate with you about orders, submissions, and support</li>
              <li>Improve our products and services</li>
              <li>Track creator royalties and related payouts</li>
            </ul>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-emerald-300">4. We Don&apos;t Sell Your Data</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              We never sell, rent, or trade your personal information.
            </p>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-emerald-300">5. Cookies</h2>
            <ul className="mt-2 space-y-1 text-sm leading-7 text-zinc-300">
              <li>We use basic cookies for site functionality.</li>
              <li>We do not use tracking or advertising cookies.</li>
            </ul>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-emerald-300">6. Your Rights</h2>
            <ul className="mt-2 space-y-1 text-sm leading-7 text-zinc-300">
              <li>You can request to see the data we have about you.</li>
              <li>You can request that we delete your data.</li>
              <li>You can opt out of non-essential communications.</li>
            </ul>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-emerald-300">7. Contact</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              Questions about privacy? Email us at WitnessProject.net@gmail.com.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
