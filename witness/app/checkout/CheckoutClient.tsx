"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import type { SettingKey } from "@/lib/site-settings";

type ShippingAddress = {
  recipient_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
};

export function CheckoutClient() {
  const { items, subtotal, clearCart } = useCart();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const orderNumber = searchParams.get("order");
  const isPaid = status === "paid";
  const [processingPayment, setProcessingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    recipient_name: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "United States",
    phone: "",
  });
  const liveCheckoutEnabled = process.env.NEXT_PUBLIC_ENABLE_LIVE_CHECKOUT !== "false";
  const [stripePaymentsEnabled, setStripePaymentsEnabled] = useState(true);
  const [ordersEnabled, setOrdersEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [didClearCartAfterPaid, setDidClearCartAfterPaid] = useState(false);

  const shippingFee = useMemo(() => (subtotal >= 50 ? 0 : 5.99), [subtotal]);
  const orderTotal = useMemo(() => subtotal + shippingFee, [shippingFee, subtotal]);

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

  useEffect(() => {
    if (isPaid && !didClearCartAfterPaid) {
      clearCart();
      setDidClearCartAfterPaid(true);
    }
  }, [clearCart, didClearCartAfterPaid, isPaid]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-8 sm:py-16 lg:px-16">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6 shadow-2xl shadow-emerald-500/10 sm:p-12">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Checkout
          </p>
          <h1 className="text-2xl font-bold leading-tight text-zinc-50 sm:text-4xl">Complete Your Order</h1>
          <p className="mt-3 text-sm text-zinc-300">Review your items, add shipping details, and place your order.</p>
          {(!liveCheckoutEnabled || !stripePaymentsEnabled || !ordersEnabled || maintenanceMode) && (
            <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
              Payments are temporarily unavailable. Please check back soon.
            </p>
          )}
          {isPaid && (
            <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
              <p className="text-sm font-semibold text-emerald-300">
                Order received! {orderNumber ? `Order #${orderNumber}` : ""}
              </p>
              <p className="mt-1 text-xs text-zinc-300">Check your email for confirmation.</p>
              <p className="mt-1 text-xs text-zinc-400">Create an account later to track your orders faster.</p>
            </div>
          )}
        </section>

        {!isPaid && items.length === 0 && (
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
              if (items.length === 0) return;

              setErrorMessage(null);
              const customer = {
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
              };
              const requiredAddressFields = [
                shippingAddress.recipient_name,
                shippingAddress.address_line1,
                shippingAddress.city,
                shippingAddress.state,
                shippingAddress.postal_code,
                shippingAddress.country,
                shippingAddress.phone,
              ];

              if (!liveCheckoutEnabled || !stripePaymentsEnabled || !ordersEnabled || maintenanceMode) {
                setErrorMessage("Payments are temporarily unavailable. Please check back soon.");
                return;
              }
              if (!customer.name || !customer.email || !customer.phone) {
                setErrorMessage("Please complete all customer fields.");
                return;
              }
              if (requiredAddressFields.some((field) => !field.trim())) {
                setErrorMessage("Please complete all shipping address fields.");
                return;
              }

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
                    shippingAddress,
                  }),
                });
                const result = (await response.json().catch(() => ({}))) as { ok?: boolean; url?: string; error?: string };
                if (!response.ok || !result.ok || !result.url) {
                  setErrorMessage(result.error ?? "Unable to start payment. Please try again.");
                  return;
                }
                window.location.href = result.url;
              } catch {
                setErrorMessage("Network error starting checkout session.");
              } finally {
                setProcessingPayment(false);
              }
            }}
          >
            <h2 className="text-xl font-semibold text-emerald-300">Guest checkout</h2>
            <div className="mt-4 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-emerald-300">Name</span>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                  placeholder="Your full name"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-emerald-300">Email</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                  placeholder="you@example.com"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-emerald-300">Phone</span>
                <input
                  required
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                  placeholder="Phone number"
                />
              </label>

              <div className="rounded-xl border border-zinc-700 bg-zinc-950/70 p-3">
                <p className="text-sm font-semibold text-emerald-300">Shipping Address</p>
                <div className="mt-3 grid gap-2">
                  <input
                    required
                    value={shippingAddress.recipient_name}
                    onChange={(e) => setShippingAddress((v) => ({ ...v, recipient_name: e.target.value }))}
                    placeholder="Recipient name"
                    className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100"
                  />
                  <input
                    required
                    value={shippingAddress.address_line1}
                    onChange={(e) => setShippingAddress((v) => ({ ...v, address_line1: e.target.value }))}
                    placeholder="Address line 1"
                    className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100"
                  />
                  <input
                    value={shippingAddress.address_line2 ?? ""}
                    onChange={(e) => setShippingAddress((v) => ({ ...v, address_line2: e.target.value }))}
                    placeholder="Address line 2 (optional)"
                    className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100"
                  />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress((v) => ({ ...v, city: e.target.value }))}
                      placeholder="City"
                      className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100"
                    />
                    <input
                      required
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress((v) => ({ ...v, state: e.target.value }))}
                      placeholder="State"
                      className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100"
                    />
                    <input
                      required
                      value={shippingAddress.postal_code}
                      onChange={(e) => setShippingAddress((v) => ({ ...v, postal_code: e.target.value }))}
                      placeholder="ZIP/postal code"
                      className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100"
                    />
                    <input
                      required
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress((v) => ({ ...v, country: e.target.value }))}
                      placeholder="Country"
                      className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100"
                    />
                  </div>
                  <input
                    required
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress((v) => ({ ...v, phone: e.target.value }))}
                    placeholder="Shipping phone"
                    className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100"
                  />
                </div>
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
                  Subtotal: <span className="font-semibold text-zinc-100">${subtotal.toFixed(2)}</span>
                </p>
                <p className="text-sm text-zinc-300">
                  Shipping:{" "}
                  <span className="font-semibold text-zinc-100">
                    {shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)}`}
                  </span>
                </p>
                <p className="text-sm text-zinc-300">
                  Total: <span className="font-semibold text-zinc-100">${orderTotal.toFixed(2)}</span>
                </p>
              </div>
            )}
          </aside>
        </section>
      </main>
    </div>
  );
}
