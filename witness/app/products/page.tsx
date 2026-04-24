"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

type ProductCategory = "T-Shirts" | "3D Prints" | "New Arrivals";

type Design = {
  id: number;
  name: string;
  category: ProductCategory;
  basePrice: number;
  fromPrice: number;
  creator: string;
  imagePath: string;
};

const filters = ["All", "T-Shirts", "3D Prints", "New Arrivals"] as const;
type FilterOption = (typeof filters)[number];

const designs: Design[] = [
  {
    id: 1,
    name: "Fair Prices Scale",
    category: "T-Shirts",
    basePrice: 12,
    fromPrice: 18,
    creator: "Frank Savage",
    imagePath: "/designs/fair-prices-scale.png",
  },
  {
    id: 2,
    name: "Transparent Costs",
    category: "T-Shirts",
    basePrice: 11.5,
    fromPrice: 18,
    creator: "Frank Savage",
    imagePath: "/designs/transparent-costs.png",
  },
  {
    id: 3,
    name: "Witness: See Everything",
    category: "T-Shirts",
    basePrice: 12,
    fromPrice: 18,
    creator: "Frank Savage",
    imagePath: "/designs/witness-eye.png",
  },
];

export default function ProductsPage() {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("All");

  const filteredDesigns = useMemo(() => {
    if (selectedFilter === "All") return designs;
    return designs.filter((design) => design.category === selectedFilter);
  }, [selectedFilter]);

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
                  onClick={() => setSelectedFilter(filter)}
                  className={
                    filter === selectedFilter
                      ? "rounded-full border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300"
                      : "rounded-full border border-zinc-700 bg-zinc-900/70 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                  }
                >
                  {filter}
                </button>
              ))}
            </div>

            {(selectedFilter === "All" || selectedFilter === "T-Shirts") && (
              <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Official Witness Catalog</p>
                <p className="mt-1 text-sm text-zinc-300">
                  These are official Witness designs, including in-house drops and designs where rights were purchased from creators.
                </p>
              </div>
            )}

            {filteredDesigns.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredDesigns.map((design) => (
                  <article
                    key={design.id}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-sm transition-colors hover:border-emerald-500/50"
                  >
                    <div className="relative h-40 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                      <div className="absolute inset-x-0 top-0 h-16 bg-emerald-500/10 blur-2xl" />
                      <Image
                        src={design.imagePath}
                        alt={design.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
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
                      <p className="text-zinc-400">Creator: {design.creator}</p>
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
            ) : (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8">
                <p className="text-lg font-semibold text-emerald-300">{selectedFilter}</p>
                {selectedFilter === "New Arrivals" ? (
                  <>
                    <p className="mt-2 text-sm text-zinc-300">
                      New Arrivals is for user-submitted content. No products now, submit design today.
                    </p>
                    <p className="mt-2 text-sm text-zinc-400">
                      If you choose a royalty agreement, you will be able to monitor sales and payouts from your user dashboard.
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-zinc-300">
                    No products now, submit design today.
                  </p>
                )}
                <button
                  type="button"
                  className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25"
                >
                  Submit Design
                </button>
              </div>
            )}
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
