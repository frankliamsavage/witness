"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export function CheckoutClient() {
  const searchParams = useSearchParams();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const summary = useMemo(() => {
    const product = searchParams.get("product") ?? "Selected product";
    const size = searchParams.get("size") ?? "M";
    const color = searchParams.get("color") ?? "Black";
    const priceValue = Number(searchParams.get("price") ?? "15");
    const price = Number.isFinite(priceValue) ? priceValue : 15;
    return { product, size, color, price };
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-12">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Checkout
          </p>
          <h1 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">Complete Your Order</h1>
          <p className="mt-3 text-sm text-zinc-300">
            Review your item, add your shipping details, and place the order.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <form
            className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              setOrderPlaced(true);
            }}
          >
            <h2 className="text-xl font-semibold text-emerald-300">Customer info</h2>
            <div className="mt-4 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-emerald-300">Name</span>
                <input
                  required
                  type="text"
                  className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                  placeholder="Your full name"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-emerald-300">Email</span>
                <input
                  required
                  type="email"
                  className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                  placeholder="you@example.com"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-emerald-300">Shipping address</span>
                <textarea
                  required
                  rows={4}
                  className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                  placeholder="Street, city, state, ZIP"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25"
            >
              Place Order
            </button>
          </form>

          <aside className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-xl font-semibold text-emerald-300">Order summary</h2>
            <div className="mt-4 rounded-xl border border-zinc-700 bg-zinc-950/80 p-4">
              <p className="text-sm font-semibold text-zinc-100">{summary.product}</p>
              <p className="mt-2 text-xs text-zinc-400">
                Size: <span className="text-zinc-200">{summary.size}</span> · Color:{" "}
                <span className="text-zinc-200">{summary.color}</span>
              </p>
              <p className="mt-3 text-sm text-zinc-300">
                Price: <span className="font-semibold text-emerald-300">${summary.price.toFixed(2)}</span>
              </p>
            </div>
          </aside>
        </section>

        {orderPlaced && (
          <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <p className="text-sm font-semibold text-emerald-300">
              Thank you! This is a demo. Orders coming soon.
            </p>
            <p className="mt-1 text-sm text-zinc-100">
              Your checkout details were captured for preview only. Live payments are not enabled yet.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
