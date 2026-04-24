const manufacturingCost = 20;
const platformFee = manufacturingCost * 0.1;
const royalty = 3;
const total = manufacturingCost + platformFee + royalty;

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 sm:px-10 lg:px-16">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-12">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            How It Works
          </p>
          <h1 className="max-w-4xl text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">
            Transparent pricing that anyone can understand
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            Witness makes pricing simple: show what it costs to make the product, add a fair platform fee, add optional designer royalty, and publish the total buyers pay.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-emerald-300">How the formula works</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Total price is built from transparent components:
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
                <p className="text-sm font-semibold text-emerald-300">Manufacturing Cost</p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  What it costs to make the product, including materials and labor.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
                <p className="text-sm font-semibold text-emerald-300">Platform Fee</p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  10% of manufacturing cost. This is our fair cut to run the platform.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
                <p className="text-sm font-semibold text-emerald-300">Royalty</p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Optional payment to the designer for custom artwork and creative IP.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
                <p className="text-sm font-semibold text-emerald-300">Total</p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  The final price shown to the buyer with no hidden layers.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <p className="text-sm font-semibold text-emerald-300">Formula</p>
              <p className="mt-2 text-lg font-semibold text-zinc-50">
                Total = Manufacturing Cost + Platform Fee (10%) + Royalty
              </p>
            </div>
          </article>

          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-emerald-300">Example breakdown</h2>
            <p className="mt-2 text-sm text-zinc-400">Sample transparent pricing for one item.</p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/70 px-4 py-3">
                <span className="text-sm text-zinc-300">Manufacturing</span>
                <span className="text-lg font-semibold text-zinc-100">${manufacturingCost}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/70 px-4 py-3">
                <span className="text-sm text-zinc-300">Platform fee (10%)</span>
                <span className="text-lg font-semibold text-zinc-100">${platformFee}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/70 px-4 py-3">
                <span className="text-sm text-zinc-300">Royalty (designer)</span>
                <span className="text-lg font-semibold text-zinc-100">${royalty}</span>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-emerald-300">Total</span>
                <span className="text-3xl font-bold text-zinc-50">${total}</span>
              </div>
              <p className="mt-2 text-sm text-zinc-300">
                Example total: $20 + $2 + $3 = $25
              </p>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
