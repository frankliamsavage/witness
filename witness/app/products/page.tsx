"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { productCatalog } from "@/lib/product-catalog";

const filters = ["All", "Official", "Creator Profiles", "Rights Acquired"] as const;
type FilterOption = (typeof filters)[number];
type ProductSize = "S" | "M" | "L" | "XL" | "XXL";
type ProductColor = "Black" | "White" | "Emerald" | "Charcoal";

const SIZE_ADJUSTMENTS: Record<ProductSize, number> = {
  S: 0,
  M: 0,
  L: 1,
  XL: 2,
  XXL: 3,
};

const COLOR_ADJUSTMENTS: Record<ProductColor, number> = {
  Black: 0,
  White: 0,
  Emerald: 1,
  Charcoal: 1,
};

type CartItem = {
  designId: number;
  name: string;
  size: ProductSize;
  color: ProductColor;
  price: number;
};

export default function ProductsPage() {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("All");
  const [selectedCreator, setSelectedCreator] = useState("All Authors");
  const [selectedSizes, setSelectedSizes] = useState<Record<number, ProductSize>>({});
  const [selectedColors, setSelectedColors] = useState<Record<number, ProductColor>>({});
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const creatorOptions = useMemo(() => {
    const creators = Array.from(
      new Set(
        productCatalog
          .filter((design) => design.moderationStatus === "approved")
          .map((design) => design.creator),
      ),
    ).sort((a, b) => a.localeCompare(b));
    return ["All Authors", ...creators];
  }, []);

  const filteredDesigns = useMemo(() => {
    if (selectedFilter === "All") return productCatalog.filter((design) => design.moderationStatus === "approved");
    if (selectedFilter === "Official") {
      return productCatalog.filter(
        (design) => design.moderationStatus === "approved" && design.contentType === "official",
      );
    }
    if (selectedFilter === "Creator Profiles") {
      const approved = productCatalog.filter((design) => design.moderationStatus === "approved");
      if (selectedCreator === "All Authors") return approved;
      return approved.filter((design) => design.creator === selectedCreator);
    }
    return productCatalog.filter(
      (design) =>
        design.moderationStatus === "approved" &&
        design.contentType === "user-submitted" &&
        design.agreementType === "One-Time",
    );
  }, [selectedCreator, selectedFilter]);

  const cartSubtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price, 0),
    [cartItems],
  );

  const getSelectedSize = (designId: number): ProductSize => selectedSizes[designId] ?? "M";
  const getSelectedColor = (designId: number): ProductColor => selectedColors[designId] ?? "Black";

  const getVariantPrice = (fromPrice: number, size: ProductSize, color: ProductColor) =>
    fromPrice + SIZE_ADJUSTMENTS[size] + COLOR_ADJUSTMENTS[color];

  const addToCart = (designId: number, buyNow?: boolean) => {
    const design = filteredDesigns.find((item) => item.id === designId);
    if (!design) return;
    const size = getSelectedSize(designId);
    const color = getSelectedColor(designId);
    const price = getVariantPrice(design.fromPrice, size, color);
    const nextItem: CartItem = { designId: design.id, name: design.name, size, color, price };
    setCartItems((prev) => [...prev, nextItem]);
  };

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

            {(selectedFilter === "All" || selectedFilter === "Official") && (
              <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Official Witness Catalog</p>
                <p className="mt-1 text-sm text-zinc-300">
                  These are official Witness designs, including in-house drops and designs where rights were purchased from creators.
                </p>
              </div>
            )}
            {selectedFilter === "Creator Profiles" && (
              <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Creator Profiles</p>
                <p className="mt-1 text-sm text-zinc-300">
                  Select an IP author to browse designs associated with that creator profile.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {creatorOptions.map((creator) => (
                    <button
                      key={creator}
                      type="button"
                      onClick={() => setSelectedCreator(creator)}
                      className={
                        creator === selectedCreator
                          ? "rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300"
                          : "rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                      }
                    >
                      {creator}
                    </button>
                  ))}
                </div>
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
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full border border-zinc-700 bg-zinc-950/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-300">
                        {design.contentType === "official" ? "Official" : "User Submitted"}
                      </span>
                      {design.contentType === "official" && (
                        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
                          Royalty-Free
                        </span>
                      )}
                      {design.moderationStatus === "approved" && (
                        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
                          Approved
                        </span>
                      )}
                    </div>
                    <h2 className="mt-1 text-lg font-semibold text-zinc-100">{design.name}</h2>

                    <div className="mt-3 space-y-1 text-sm text-zinc-300">
                      <p>
                        Base price: <span className="font-semibold text-zinc-100">${design.basePrice.toFixed(2)}</span>
                      </p>
                      <p>
                        From <span className="font-semibold text-emerald-300">${design.fromPrice.toFixed(2)}</span>
                      </p>
                      <p className="text-zinc-400">Creator: {design.creator}</p>
                      {design.agreementType && (
                        <p className="text-zinc-400">
                          Agreement: {design.agreementType}
                          {design.royaltyPercent ? ` (${design.royaltyPercent}% royalty)` : ""}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 grid gap-3">
                      <div className="grid grid-cols-2 gap-2">
                        <label className="grid gap-1">
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Size</span>
                          <select
                            value={getSelectedSize(design.id)}
                            onChange={(e) =>
                              setSelectedSizes((prev) => ({ ...prev, [design.id]: e.target.value as ProductSize }))
                            }
                            className="rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                          >
                            {Object.keys(SIZE_ADJUSTMENTS).map((size) => (
                              <option key={size} value={size}>
                                {size}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="grid gap-1">
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Color</span>
                          <select
                            value={getSelectedColor(design.id)}
                            onChange={(e) =>
                              setSelectedColors((prev) => ({
                                ...prev,
                                [design.id]: e.target.value as ProductColor,
                              }))
                            }
                            className="rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                          >
                            {Object.keys(COLOR_ADJUSTMENTS).map((color) => (
                              <option key={color} value={color}>
                                {color}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <p className="text-xs text-zinc-400">
                        Variant price:{" "}
                        <span className="font-semibold text-emerald-300">
                          $
                          {getVariantPrice(
                            design.fromPrice,
                            getSelectedSize(design.id),
                            getSelectedColor(design.id),
                          ).toFixed(2)}
                        </span>
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => addToCart(design.id)}
                          className="rounded-xl border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                        >
                          Add to Cart
                        </button>
                        <Link
                          href={`/checkout?product=${encodeURIComponent(design.name)}&size=${encodeURIComponent(
                            getSelectedSize(design.id),
                          )}&color=${encodeURIComponent(getSelectedColor(design.id))}&price=${encodeURIComponent(
                            getVariantPrice(
                              design.fromPrice,
                              getSelectedSize(design.id),
                              getSelectedColor(design.id),
                            ).toFixed(2),
                          )}`}
                          className="rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25"
                        >
                          Buy Now
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8">
                <p className="text-lg font-semibold text-emerald-300">{selectedFilter}</p>
                {selectedFilter === "Creator Profiles" ? (
                  <>
                    <p className="mt-2 text-sm text-zinc-300">
                      No approved designs are available for this creator yet.
                    </p>
                    <p className="mt-2 text-sm text-zinc-400">
                      Creator profile matching appears here once their designs are approved.
                    </p>
                  </>
                ) : selectedFilter === "Rights Acquired" ? (
                  <p className="mt-2 text-sm text-zinc-300">
                    No rights-acquired products are live yet.
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-zinc-300">
                    No products are live in this section yet.
                  </p>
                )}
                <Link
                  href="/submit-design"
                  className="mt-4 inline-flex rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25"
                >
                  Submit Design
                </Link>
                {(selectedFilter === "Creator Profiles" || selectedFilter === "Rights Acquired") && (
                  <Link
                    href="/submit-design"
                    className="ml-3 inline-flex rounded-xl border border-zinc-700 bg-zinc-900/70 px-4 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                  >
                    Be first to submit
                  </Link>
                )}
              </div>
            )}
          </div>

          <aside className="h-fit space-y-4">
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
              <h3 className="text-xl font-semibold text-emerald-300">Cart</h3>
              <p className="mt-2 text-sm text-zinc-300">
                {cartItems.length === 0
                  ? "Your cart is empty. Add a design to start checkout."
                  : `${cartItems.length} item${cartItems.length === 1 ? "" : "s"} in cart`}
              </p>
              {cartItems.length > 0 && (
                <div className="mt-4 space-y-2">
                  {cartItems.map((item, idx) => (
                    <div key={`${item.designId}-${idx}`} className="rounded-lg border border-zinc-700 bg-zinc-950/70 p-2">
                      <p className="text-xs font-semibold text-zinc-100">{item.name}</p>
                      <p className="text-[11px] text-zinc-400">
                        {item.size} · {item.color}
                      </p>
                      <p className="text-xs font-semibold text-emerald-300">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                  <p className="pt-1 text-sm text-zinc-300">
                    Subtotal: <span className="font-semibold text-zinc-100">${cartSubtotal.toFixed(2)}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const firstItem = cartItems[0];
                      if (!firstItem) return;
                      window.location.href = `/checkout?product=${encodeURIComponent(
                        firstItem.name,
                      )}&size=${encodeURIComponent(firstItem.size)}&color=${encodeURIComponent(
                        firstItem.color,
                      )}&price=${encodeURIComponent(firstItem.price.toFixed(2))}`;
                    }}
                    className="mt-1 inline-flex w-full items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25"
                  >
                    Go to checkout
                  </button>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
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
              <Link
                href="/submit-design"
                className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900/70 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
              >
                Submit a Design
              </Link>
              <p className="mt-4 text-xs text-zinc-400">
                Choosing a design here is step one. Product options and customization can be selected next.
              </p>
            </section>
          </aside>
        </section>

      </main>
    </div>
  );
}
