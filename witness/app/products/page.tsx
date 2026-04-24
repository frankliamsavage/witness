import Link from "next/link";

type Design = {
  id: number;
  name: string;
  category: "T-Shirts" | "3D Prints" | "New Arrivals";
  basePrice: number;
  fromPrice: number;
  creator?: string;
  previewLabel: string;
};

const filters = ["All", "T-Shirts", "3D Prints", "New Arrivals"] as const;

const mockDesigns: Design[] = [
  {
    id: 1,
    name: "Neon Witness Logo",
    category: "T-Shirts",
    basePrice: 12,
    fromPrice: 18,
    creator: "A. Rivera",
    previewLabel: "NEON",
  },
  {
    id: 2,
    name: "Transparent Future",
    category: "T-Shirts",
    basePrice: 11.5,
    fromPrice: 17,
    creator: "KJ Studio",
    previewLabel: "FUTURE",
  },
  {
    id: 3,
    name: "Voxel Witness Mark",
    category: "3D Prints",
    basePrice: 14,
    fromPrice: 22,
    previewLabel: "VOXEL",
  },
  {
    id: 4,
    name: "Signal Coin Stand",
    category: "3D Prints",
    basePrice: 16,
    fromPrice: 25,
    creator: "M. Cho",
    previewLabel: "SIGNAL",
  },
  {
    id: 5,
    name: "Open Ledger Drop",
    category: "New Arrivals",
    basePrice: 13,
    fromPrice: 20,
    creator: "Witness Lab",
    previewLabel: "LEDGER",
  },
  {
    id: 6,
    name: "Community Pulse",
    category: "New Arrivals",
    basePrice: 12.5,
    fromPrice: 19,
    previewLabel: "PULSE",
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-16 sm:px-10 lg:px-16">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-12">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Products
          </p>
          <h1 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">Browse Designs</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
            Pick a design to create your custom product.
          </p>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
          <div>
            <div className="mb-6 flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={
                    filter === "All"
                      ? "rounded-full border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300"
                      : "rounded-full border border-zinc-700 bg-zinc-900/70 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                  }
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {mockDesigns.map((design) => (
                <article
                  key={design.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-sm transition-colors hover:border-emerald-500/50"
                >
                  <div className="flex h-32 items-center justify-center rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-800 text-sm font-semibold tracking-wide text-emerald-300">
                    {design.previewLabel}
                  </div>

                  <p className="mt-3 text-xs font-medium uppercase tracking-wide text-zinc-400">{design.category}</p>
                  <h2 className="mt-1 text-lg font-semibold text-zinc-100">{design.name}</h2>

                  <div className="mt-3 space-y-1 text-sm text-zinc-300">
                    <p>
                      Base price: <span className="font-semibold text-zinc-100">${design.basePrice.toFixed(2)}</span>
                    </p>
                    <p>
                      From <span className="font-semibold text-emerald-300">${design.fromPrice.toFixed(2)}</span>
                    </p>
                    <p className="text-zinc-400">Creator: {design.creator ?? "In-house design"}</p>
                  </div>

                  <button
                    type="button"
                    className="mt-4 w-full rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25"
                  >
                    Select Design
                  </button>
                </article>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h3 className="text-xl font-semibold text-emerald-300">How It Works</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              See exactly how each product price is built, from base production cost to operating margin and creator royalties.
            </p>
            <Link
              href="/how-it-works"
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25"
            >
              View Pricing Breakdown
            </Link>
            <p className="mt-4 text-xs text-zinc-400">
              Choosing a design here is step one. Product options and customization can be selected next.
            </p>
          </aside>
        </section>
      </main>
    </div>
  );
}
