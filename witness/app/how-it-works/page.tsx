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
            <p className="mt-2 text-sm text-zinc-400">Example: $18.00 t-shirt</p>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
                    Base Production Cost (64%)
                  </p>
                  <p className="text-sm font-semibold text-zinc-100">$11.50</p>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-zinc-800">
                  <div className="h-2 rounded-full bg-emerald-500/80" style={{ width: "64%" }} />
                </div>
                <div className="mt-4 space-y-2 text-sm text-zinc-300">
                  <div className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2">
                    <span>Blank shirt</span>
                    <span className="font-semibold text-zinc-100">$9.00 (50%)</span>
                  </div>
                  <div className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2">
                    <span>Labor</span>
                    <span className="font-semibold text-zinc-100">$1.00 (5.5%)</span>
                  </div>
                  <div className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2">
                    <span>Supplies</span>
                    <span className="font-semibold text-zinc-100">$1.50 (8.3%)</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
                    Platform / Operating Margin (36%)
                  </p>
                  <p className="text-sm font-semibold text-zinc-100">$6.50</p>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-zinc-800">
                  <div className="h-2 rounded-full bg-emerald-400/65" style={{ width: "36%" }} />
                </div>
                <p className="mt-3 text-sm text-zinc-300">
                  Covers operations, payment fees, replacements, and growth.
                </p>
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
