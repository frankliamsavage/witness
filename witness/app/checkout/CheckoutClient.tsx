"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import type { SettingKey } from "@/lib/site-settings";

type InitialCustomer = {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

export function CheckoutClient({ initialCustomer }: { initialCustomer: InitialCustomer }) {
  const { items, subtotal } = useCart();
  const [processingPayment, setProcessingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const liveCheckoutEnabled = process.env.NEXT_PUBLIC_ENABLE_LIVE_CHECKOUT !== "false";
  const [stripePaymentsEnabled, setStripePaymentsEnabled] = useState(true);
  const [ordersEnabled, setOrdersEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/settings/public", { cache: "no-store" });
        const result = (await response.json().catch(() => ({}))) as {
          ok?: boolean;
          settings?: Partial<Record<SettingKey, boolean>>;
        };
        if (!cancelled && response.ok && result.ok) {
          const settings = result.settings ?? {};
          setStripePaymentsEnabled(settings.stripe_payments_enabled !== false);
          setOrdersEnabled(settings.orders_enabled !== false);
          setMaintenanceMode(settings.site_maintenance_mode === true);
        }
      } catch {
        if (!cancelled) setStripePaymentsEnabled(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
          {(!liveCheckoutEnabled || !stripePaymentsEnabled || !ordersEnabled || maintenanceMode) && (
            <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
              Payments are temporarily unavailable. Please check back soon.
            </p>
          )}
        </section>

        {items.length === 0 && (
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
            className="order-2 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8 lg:order-1"
            onSubmit={async (e) => {
              e.preventDefault();
              setErrorMessage(null);
              const form = e.currentTarget as HTMLFormElement;
              const data = new FormData(form);
              const customer = {
                name: String(data.get("name") ?? ""),
                email: String(data.get("email") ?? ""),
                address: String(data.get("address") ?? ""),
                city: String(data.get("city") ?? ""),
                state: String(data.get("state") ?? ""),
                zip: String(data.get("zip") ?? ""),
              };

              if (!liveCheckoutEnabled || !stripePaymentsEnabled || !ordersEnabled || maintenanceMode) {
                setErrorMessage("Payments are temporarily unavailable. Please check back soon.");
                return;
              }

              if (liveCheckoutEnabled && stripePaymentsEnabled) {
                setProcessingPayment(true);
                try {
                  const response = await fetch("/api/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      items: items.map((item) => ({
                        name: `${item.name} (${item.size}, ${item.color})`,
                        quantity: item.quantity,
                        price: item.price,
                      })),
                      customer,
                    }),
                  });
                  const result = (await response.json().catch(() => ({}))) as { ok?: boolean; url?: string; error?: string };
                  if (!response.ok || !result.ok || !result.url) {
                    setErrorMessage(result.error ?? "Unable to start payment. Please try again.");
                    return;
                  }
                  window.location.href = result.url;
                  return;
                } catch {
                  setErrorMessage("Network error starting checkout session.");
                  return;
                } finally {
                  setProcessingPayment(false);
                }
              }

            }}
          >
            <h2 className="text-xl font-semibold text-emerald-300">Customer info</h2>
            <p className="mt-2 text-xs text-zinc-400">
              Need to update your saved shipping details?{" "}
              <Link href="/account/shipping" className="font-semibold text-emerald-300 hover:underline">
                Edit shipping info
              </Link>
              .
            </p>
            <div className="mt-4 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-emerald-300">Name</span>
                <input
                  required
                  type="text"
                  name="name"
                  defaultValue={initialCustomer.name}
                  className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                  placeholder="Your full name"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-emerald-300">Email</span>
                <input
                  required
                  type="email"
                  name="email"
                  defaultValue={initialCustomer.email}
                  className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                  placeholder="you@example.com"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-emerald-300">Street Address</span>
                <textarea
                  required
                  name="address"
                  defaultValue={initialCustomer.address}
                  rows={3}
                  className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                  placeholder="Street and apartment/unit"
                />
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <label className="grid gap-2 sm:col-span-1">
                  <span className="text-sm font-semibold text-emerald-300">City</span>
                  <input
                    required
                    type="text"
                    name="city"
                    defaultValue={initialCustomer.city}
                    className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                    placeholder="City"
                  />
                </label>
                <label className="grid gap-2 sm:col-span-1">
                  <span className="text-sm font-semibold text-emerald-300">State</span>
                  <input
                    required
                    type="text"
                    name="state"
                    defaultValue={initialCustomer.state}
                    className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                    placeholder="State"
                  />
                </label>
                <label className="grid gap-2 sm:col-span-1">
                  <span className="text-sm font-semibold text-emerald-300">ZIP</span>
                  <input
                    required
                    type="text"
                    name="zip"
                    defaultValue={initialCustomer.zip}
                    className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                    placeholder="ZIP"
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={
                items.length === 0 ||
                processingPayment ||
                !liveCheckoutEnabled ||
                !stripePaymentsEnabled ||
                !ordersEnabled ||
                maintenanceMode
              }
              className="mobile-touch-target mt-5 inline-flex w-full items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {liveCheckoutEnabled && stripePaymentsEnabled && ordersEnabled && !maintenanceMode
                ? processingPayment
                  ? "Starting Payment..."
                  : "Proceed to Secure Payment"
                : "Payments Unavailable"}
            </button>
            {errorMessage && (
              <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {errorMessage}
              </p>
            )}
          </form>

          <aside className="order-1 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 lg:order-2">
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

      </main>
    </div>
  );
}
