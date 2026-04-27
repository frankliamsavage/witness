"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartContext";

export function CheckoutClient() {
  const { items, subtotal, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-8 sm:py-16 lg:px-16">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6 shadow-2xl shadow-emerald-500/10 sm:p-12">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Checkout
          </p>
          <h1 className="text-2xl font-bold leading-tight text-zinc-50 sm:text-4xl">Complete Your Order</h1>
          <p className="mt-3 text-sm text-zinc-300">
            Review your item, add your shipping details, and place the order.
          </p>
        </section>

        {items.length === 0 && !orderPlaced && (
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8">
            <p className="text-sm text-zinc-300">Your cart is empty. Add products before checkout.</p>
            <Link
              href="/products"
              className="mobile-touch-target mt-4 inline-flex w-full rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-center text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25 sm:w-auto"
            >
              Browse Products
            </Link>
          </section>
        )}

        <section className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          <form
            className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              clearCart();
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
              disabled={items.length === 0}
              className="mobile-touch-target mt-5 inline-flex w-full items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Place Order
            </button>
          </form>

          <aside className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-xl font-semibold text-emerald-300">Order summary</h2>
            {items.length === 0 ? (
              <p className="mt-3 text-sm text-zinc-400">No items in cart.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="rounded-xl border border-zinc-700 bg-zinc-950/80 p-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900">
                        <Image src={item.imagePath} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-zinc-100">{item.name}</p>
                        <p className="text-xs text-zinc-400">
                          {item.size} · {item.color} · Qty {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-emerald-300">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                <p className="pt-2 text-sm text-zinc-300">
                  Total: <span className="font-semibold text-zinc-100">${subtotal.toFixed(2)}</span>
                </p>
              </div>
            )}
          </aside>
        </section>

        {orderPlaced && (
          <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <p className="text-sm font-semibold text-emerald-300">
              Thank you! This is a demo.
            </p>
            <p className="mt-1 text-sm text-zinc-100">
              Orders are coming soon. Live payment processing is not enabled yet.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
