import Link from "next/link";

const REVENUE_ROYALTY_TIERS = [
  { range: "$0 - $1,000", rate: "10%" },
  { range: "$1,000 - $6,000", rate: "15%" },
  { range: "$6,000 - $12,000", rate: "20%" },
  { range: "$12,000 - $100,000", rate: "25%" },
  { range: "$100,000+", rate: "30%" },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:gap-12 sm:px-8 sm:py-16 lg:px-16">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6 shadow-2xl shadow-emerald-500/10 sm:p-12">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            How It Works
          </p>
          <h1 className="max-w-4xl text-2xl font-bold leading-tight text-zinc-50 sm:text-4xl">
            How Pricing Works
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-300 sm:mt-5 sm:text-lg sm:leading-7">
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
                  If the product uses submitted intellectual property, creators on royalty agreements move through tiered rates as total sales grow.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-emerald-300">Example breakdown</h2>
            <p className="mt-2 text-sm text-zinc-400">Example: $15.00 retail t-shirt</p>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
                    Total Base Cost (59.7%)
                  </p>
                  <p className="text-sm font-semibold text-zinc-100">$8.95</p>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-zinc-800">
                  <div className="h-2 rounded-full bg-emerald-500/80" style={{ width: "59.7%" }} />
                </div>
                <div className="mt-4 space-y-2 text-sm text-zinc-300">
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2">
                    <span>Blank (with 20% markup)</span>
                    <span className="font-semibold text-zinc-100">$5.75</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2">
                    <span>Ink & Supplies</span>
                    <span className="font-semibold text-zinc-100">$0.60</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2">
                    <span>Machine Cost (recoup)</span>
                    <span className="font-semibold text-zinc-100">$0.60</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2">
                    <span>Labor</span>
                    <span className="font-semibold text-zinc-100">$2.00</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
                    Platform Margin (40.3%)
                  </p>
                  <p className="text-sm font-semibold text-zinc-100">$6.05</p>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-zinc-800">
                  <div className="h-2 rounded-full bg-emerald-400/65" style={{ width: "40.3%" }} />
                </div>
                <p className="mt-3 text-sm text-zinc-300">
                  Built into the $15 retail price to cover operations, risk, and profit.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-base font-semibold text-emerald-300">Retail Price</span>
                <span className="text-3xl font-bold text-zinc-50">$15.00</span>
              </div>
              <p className="mt-2 text-sm text-zinc-300">
                At max 30% royalty, creator gets $4.50 and Witness keeps $1.55+ profit.
              </p>
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-emerald-300">Tiered Royalty System</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-zinc-300">
            Royalty is based on each creator&apos;s total gross revenue and uses progressive tiers (each rate applies only
            to revenue inside that range).
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {REVENUE_ROYALTY_TIERS.map((tier) => (
              <div key={`${tier.range}-${tier.rate}`} className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
                <p className="text-lg font-bold text-emerald-300">{tier.rate}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-zinc-400">Revenue Tier</p>
                <p className="mt-2 text-sm text-zinc-300">{tier.range}</p>
              </div>
            ))}
          </div>
          <ul className="mt-5 space-y-2 text-sm text-zinc-300">
            <li>At $15 retail, max 30% royalty pays creator $4.50 per unit.</li>
            <li>At that same top tier, Witness retains $1.55+ profit after base cost and royalty.</li>
            <li>Progressive means higher rates apply only to the revenue inside each tier band.</li>
          </ul>
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
          <Link
            href="/submit-design"
            className="mobile-touch-target mt-5 inline-flex w-full items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25 sm:w-auto"
          >
            Submit Your Work
          </Link>
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
