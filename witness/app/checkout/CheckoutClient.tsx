"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import type { SettingKey } from "@/lib/site-settings";

type InitialCustomer = {
  name: string;
  email: string;
  phone: string;
};

type Address = {
  id: string;
  label: string | null;
  recipient_name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
};

const EMPTY_ADDRESS = {
  label: "",
  recipient_name: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "United States",
  phone: "",
  is_default: false,
};

export function CheckoutClient({
  initialCustomer,
  initialAddresses,
}: {
  initialCustomer: InitialCustomer;
  initialAddresses: Address[];
}) {
  const { items, subtotal } = useCart();
  const [processingPayment, setProcessingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    initialAddresses.find((a) => a.is_default)?.id ?? initialAddresses[0]?.id ?? null,
  );
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState(EMPTY_ADDRESS);
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
                phone: String(data.get("phone") ?? ""),
              };
              const selectedAddress = addresses.find((address) => address.id === selectedAddressId);

              if (!liveCheckoutEnabled || !stripePaymentsEnabled || !ordersEnabled || maintenanceMode) {
                setErrorMessage("Payments are temporarily unavailable. Please check back soon.");
                return;
              }
              if (!selectedAddress) {
                setErrorMessage("Please select or add a shipping address before checkout.");
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
                      shippingAddress: selectedAddress,
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
              Need to manage saved addresses?{" "}
              <Link href="/account/addresses" className="font-semibold text-emerald-300 hover:underline">
                Open address book
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
                <span className="text-sm font-semibold text-emerald-300">Phone (optional)</span>
                <input
                  type="text"
                  name="phone"
                  defaultValue={initialCustomer.phone}
                  className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                  placeholder="Phone number"
                />
              </label>
              <div className="rounded-xl border border-zinc-700 bg-zinc-950/70 p-3">
                <p className="text-sm font-semibold text-emerald-300">Shipping Address</p>
                {!addresses.length ? (
                  <p className="mt-2 text-xs text-zinc-400">No shipping address on file. Add one to continue.</p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {addresses.map((address) => (
                      <label key={address.id} className="flex cursor-pointer items-start gap-2 rounded-lg border border-zinc-700 p-2 text-xs text-zinc-200">
                        <input
                          type="radio"
                          name="selected-address"
                          checked={selectedAddressId === address.id}
                          onChange={() => setSelectedAddressId(address.id)}
                          className="mt-0.5"
                        />
                        <span>
                          <span className="font-semibold text-zinc-100">{address.label || "Address"}</span>{" "}
                          {address.is_default ? <span className="text-emerald-300">(Default)</span> : null}
                          <br />
                          {address.recipient_name} · {address.address_line1}
                          {address.address_line2 ? `, ${address.address_line2}` : ""}, {address.city}, {address.state}{" "}
                          {address.postal_code}, {address.country}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setAddingAddress((value) => !value)}
                  className="mt-3 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200"
                >
                  {addingAddress ? "Cancel new address" : "Add new address"}
                </button>
                {addingAddress && (
                  <div className="mt-3 grid gap-2">
                    <input value={newAddress.label} onChange={(e) => setNewAddress((v) => ({ ...v, label: e.target.value }))} placeholder="Label (Home, Work)" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100" />
                    <input value={newAddress.recipient_name} onChange={(e) => setNewAddress((v) => ({ ...v, recipient_name: e.target.value }))} placeholder="Recipient name" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100" />
                    <input value={newAddress.address_line1} onChange={(e) => setNewAddress((v) => ({ ...v, address_line1: e.target.value }))} placeholder="Address line 1" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100" />
                    <input value={newAddress.address_line2} onChange={(e) => setNewAddress((v) => ({ ...v, address_line2: e.target.value }))} placeholder="Address line 2 (optional)" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100" />
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input value={newAddress.city} onChange={(e) => setNewAddress((v) => ({ ...v, city: e.target.value }))} placeholder="City" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100" />
                      <input value={newAddress.state} onChange={(e) => setNewAddress((v) => ({ ...v, state: e.target.value }))} placeholder="State" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100" />
                      <input value={newAddress.postal_code} onChange={(e) => setNewAddress((v) => ({ ...v, postal_code: e.target.value }))} placeholder="ZIP/postal code" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100" />
                      <input value={newAddress.country} onChange={(e) => setNewAddress((v) => ({ ...v, country: e.target.value }))} placeholder="Country" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100" />
                    </div>
                    <input value={newAddress.phone} onChange={(e) => setNewAddress((v) => ({ ...v, phone: e.target.value }))} placeholder="Phone (optional)" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100" />
                    <label className="flex items-center gap-2 text-xs text-zinc-300">
                      <input type="checkbox" checked={newAddress.is_default} onChange={(e) => setNewAddress((v) => ({ ...v, is_default: e.target.checked }))} />
                      Set as default
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        void (async () => {
                          setErrorMessage(null);
                          const response = await fetch("/api/account/addresses", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(newAddress),
                          });
                          const result = (await response.json().catch(() => ({}))) as {
                            ok?: boolean;
                            address?: Address;
                            error?: string;
                          };
                          if (!response.ok || !result.ok || !result.address) {
                            setErrorMessage(result.error ?? "Unable to save address.");
                            return;
                          }
                          setAddresses((prev) => {
                            const next = newAddress.is_default
                              ? prev.map((a) => ({ ...a, is_default: false }))
                              : prev.slice();
                            return [result.address as Address, ...next];
                          });
                          setSelectedAddressId(result.address.id);
                          setAddingAddress(false);
                          setNewAddress(EMPTY_ADDRESS);
                        })()
                      }
                      className="rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-300"
                    >
                      Save address
                    </button>
                  </div>
                )}
              </div>
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
