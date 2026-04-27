"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeFromCart, clearCart, itemCount } = useCart();
  const liveCheckoutEnabled = process.env.NEXT_PUBLIC_ENABLE_LIVE_CHECKOUT !== "false";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-8 sm:py-16 lg:px-16">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6 shadow-2xl shadow-emerald-500/10 sm:p-12">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Cart
          </p>
          <h1 className="text-2xl font-bold leading-tight text-zinc-50 sm:text-4xl">Your Shopping Cart</h1>
          <p className="mt-3 text-sm text-zinc-300">
            {itemCount === 0
              ? "Your cart is currently empty."
              : `${itemCount} item${itemCount === 1 ? "" : "s"} ready for checkout.`}
          </p>
        </section>

        {items.length === 0 ? (
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8">
            <p className="text-sm text-zinc-300">Add products to your cart to continue.</p>
            <Link
              href="/products"
              className="mt-4 inline-flex rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25"
            >
              Browse Products
            </Link>
          </section>
        ) : (
          <section className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
            <aside className="order-1 h-fit rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 lg:order-2">
              <h2 className="text-xl font-semibold text-emerald-300">Order Summary</h2>
              <p className="mt-3 text-sm text-zinc-300">
                Subtotal: <span className="font-semibold text-zinc-100">${subtotal.toFixed(2)}</span>
              </p>
              <p className="mt-1 text-xs text-zinc-400">Shipping and tax are calculated at final checkout.</p>
              {!liveCheckoutEnabled && (
                <p className="mt-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[11px] text-amber-200">
                  Demo mode: checkout currently does not process real payments.
                </p>
              )}
              <Link
                href="/checkout"
                className="mobile-touch-target mt-4 inline-flex w-full items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25"
              >
                {liveCheckoutEnabled ? "Checkout" : "Test Checkout"}
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="mobile-touch-target mt-3 inline-flex w-full items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900/70 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
              >
                Clear Cart
              </button>
            </aside>

            <div className="order-2 space-y-4 lg:order-1">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 sm:p-5"
                >
                  <div className="grid gap-4 sm:grid-cols-[110px_1fr_auto] sm:items-center">
                    <div className="relative h-24 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950 sm:h-28">
                      <Image src={item.imagePath} alt={item.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-100">{item.name}</p>
                      <p className="mt-1 text-xs text-zinc-400">
                        Size: {item.size} · Color: {item.color}
                      </p>
                      <p className="mt-2 text-sm text-zinc-300">
                        ${item.price.toFixed(2)} each ·{" "}
                        <span className="font-semibold text-emerald-300">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="mobile-touch-target rounded-lg border border-zinc-700 px-3 py-1 text-sm font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                      >
                        -
                      </button>
                      <span className="min-w-8 text-center text-sm font-semibold text-zinc-100">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="mobile-touch-target rounded-lg border border-zinc-700 px-3 py-1 text-sm font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="mobile-touch-target ml-0 rounded-lg border border-zinc-700 px-3 py-1 text-sm font-semibold text-zinc-300 transition-colors hover:border-red-500/40 hover:text-red-300 sm:ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
