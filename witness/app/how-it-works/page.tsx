export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 sm:px-10 lg:px-16">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-12">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            How It Works
          </p>
          <h1 className="max-w-4xl text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">
            How Pricing Works
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            Every product price is built from three simple parts. No hidden math, no confusing markups, and no corporate language.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-emerald-300">Three simple parts</h2>
            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
                <p className="text-base font-semibold text-emerald-300">1. Base Production Cost</p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  This includes the blank item, materials, printing and production supplies, packaging, and the time required to make the product.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
                <p className="text-base font-semibold text-emerald-300">2. Platform / Operating Margin</p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  This helps cover website costs, payment processing, tools, equipment wear, mistakes, replacements, and business growth.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
                <p className="text-base font-semibold text-emerald-300">3. Creator Royalty</p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  If the product uses submitted intellectual property, the creator may receive a royalty per sale or a one-time payment agreement.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-emerald-300">Example breakdown</h2>
            <p className="mt-2 text-sm text-zinc-400">Simple shirt example.</p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/70 px-4 py-3">
                <span className="text-sm text-zinc-300">Blank shirt</span>
                <span className="text-lg font-semibold text-zinc-100">$9.00</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/70 px-4 py-3">
                <span className="text-sm text-zinc-300">Production labor</span>
                <span className="text-lg font-semibold text-zinc-100">$1.00</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/70 px-4 py-3">
                <span className="text-sm text-zinc-300">Supplies / packaging</span>
                <span className="text-lg font-semibold text-zinc-100">$1.50</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/70 px-4 py-3">
                <span className="text-sm text-zinc-300">Operating margin</span>
                <span className="text-lg font-semibold text-zinc-100">$6.50</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/70 px-4 py-3">
                <span className="text-sm text-zinc-300">Creator royalty (if applicable)</span>
                <span className="text-lg font-semibold text-zinc-100">Varies</span>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-emerald-300">Total</span>
                <span className="text-3xl font-bold text-zinc-50">$18.00+</span>
              </div>
              <p className="mt-2 text-sm text-zinc-300">Final customer price depends on royalty agreement terms.</p>
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-emerald-300">Submit Your Design or Idea</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-zinc-300">
            Creators may submit original artwork, slogans, concepts, or product ideas for review. If accepted, the design may be sold through our store under one of two agreement options:
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
              <p className="text-base font-semibold text-emerald-300">Royalty Agreement</p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                The creator earns a percentage from each sale.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
              <p className="text-base font-semibold text-emerald-300">One-Time Purchase</p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                The company buys the rights to use the design for an agreed payment.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Disclaimer</p>
          <p className="mt-2 text-sm leading-6 text-zinc-200">
            Submitting a design does not guarantee acceptance, publication, or payment. Ownership and payment terms must be agreed to in writing before any design is sold.
          </p>
        </section>
      </main>
    </div>
  );
}
