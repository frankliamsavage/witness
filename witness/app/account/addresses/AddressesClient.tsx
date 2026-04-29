"use client";

import { useEffect, useState } from "react";

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

type AddressDraft = Omit<Address, "id">;

const EMPTY_DRAFT: AddressDraft = {
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

export function AddressesClient() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<AddressDraft>(EMPTY_DRAFT);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const response = await fetch("/api/account/addresses", { cache: "no-store" });
    const result = (await response.json().catch(() => ({}))) as { ok?: boolean; addresses?: Address[]; error?: string };
    if (!response.ok || !result.ok) {
      setError(result.error ?? "Failed to load addresses.");
      setLoading(false);
      return;
    }
    setAddresses(result.addresses ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    const url = editingId ? `/api/account/addresses/${editingId}` : "/api/account/addresses";
    const method = editingId ? "PATCH" : "POST";
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const result = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (!response.ok || !result.ok) {
      setError(result.error ?? "Unable to save address.");
      setSaving(false);
      return;
    }
    await load();
    setDraft(EMPTY_DRAFT);
    setEditingId(null);
    setMessage(editingId ? "Address updated." : "Address added.");
    setSaving(false);
  };

  const onDelete = async (id: string) => {
    setError(null);
    setMessage(null);
    const response = await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    const result = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (!response.ok || !result.ok) {
      setError(result.error ?? "Unable to delete address.");
      return;
    }
    await load();
    setMessage("Address deleted.");
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
        <h2 className="text-xl font-semibold text-emerald-300">Saved Addresses</h2>
        {loading ? (
          <p className="mt-4 text-sm text-zinc-300">Loading addresses...</p>
        ) : !addresses.length ? (
          <p className="mt-4 text-sm text-zinc-300">No shipping address on file.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {addresses.map((address) => (
              <div key={address.id} className="rounded-xl border border-zinc-700 bg-zinc-950/70 p-3 text-sm text-zinc-200">
                <p className="font-semibold text-zinc-100">
                  {address.label || "Address"} {address.is_default ? <span className="text-emerald-300">(Default)</span> : null}
                </p>
                <p className="mt-1 text-xs text-zinc-300">{address.recipient_name}</p>
                <p className="text-xs text-zinc-400">
                  {address.address_line1}
                  {address.address_line2 ? `, ${address.address_line2}` : ""}, {address.city}, {address.state} {address.postal_code}, {address.country}
                </p>
                <p className="text-xs text-zinc-400">{address.phone || "-"}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setEditingId(address.id);
                      setDraft({
                        label: address.label,
                        recipient_name: address.recipient_name,
                        address_line1: address.address_line1,
                        address_line2: address.address_line2,
                        city: address.city,
                        state: address.state,
                        postal_code: address.postal_code,
                        country: address.country,
                        phone: address.phone,
                        is_default: address.is_default,
                      });
                    }}
                    className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200"
                  >
                    Edit
                  </button>
                  {!address.is_default && (
                    <button
                      onClick={() =>
                        void (async () => {
                          setEditingId(address.id);
                          setDraft({
                            label: address.label,
                            recipient_name: address.recipient_name,
                            address_line1: address.address_line1,
                            address_line2: address.address_line2,
                            city: address.city,
                            state: address.state,
                            postal_code: address.postal_code,
                            country: address.country,
                            phone: address.phone,
                            is_default: true,
                          });
                          await fetch(`/api/account/addresses/${address.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              label: address.label,
                              recipient_name: address.recipient_name,
                              address_line1: address.address_line1,
                              address_line2: address.address_line2,
                              city: address.city,
                              state: address.state,
                              postal_code: address.postal_code,
                              country: address.country,
                              phone: address.phone,
                              is_default: true,
                            }),
                          });
                          await load();
                          setEditingId(null);
                          setDraft(EMPTY_DRAFT);
                          setMessage("Default address updated.");
                        })()
                      }
                      className="rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300"
                    >
                      Set default
                    </button>
                  )}
                  <button
                    onClick={() => void onDelete(address.id)}
                    className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-semibold text-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </article>

      <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
        <h2 className="text-xl font-semibold text-emerald-300">{editingId ? "Edit Address" : "Add Address"}</h2>
        <form onSubmit={onSave} className="mt-4 grid gap-3">
          <input value={draft.label ?? ""} onChange={(e) => setDraft((v) => ({ ...v, label: e.target.value }))} placeholder="Label (Home, Work)" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <input required value={draft.recipient_name} onChange={(e) => setDraft((v) => ({ ...v, recipient_name: e.target.value }))} placeholder="Recipient name" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <input required value={draft.address_line1} onChange={(e) => setDraft((v) => ({ ...v, address_line1: e.target.value }))} placeholder="Address line 1" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <input value={draft.address_line2 ?? ""} onChange={(e) => setDraft((v) => ({ ...v, address_line2: e.target.value }))} placeholder="Address line 2 (optional)" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <div className="grid gap-2 sm:grid-cols-2">
            <input required value={draft.city} onChange={(e) => setDraft((v) => ({ ...v, city: e.target.value }))} placeholder="City" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
            <input required value={draft.state} onChange={(e) => setDraft((v) => ({ ...v, state: e.target.value }))} placeholder="State" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
            <input required value={draft.postal_code} onChange={(e) => setDraft((v) => ({ ...v, postal_code: e.target.value }))} placeholder="ZIP/postal code" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
            <input required value={draft.country} onChange={(e) => setDraft((v) => ({ ...v, country: e.target.value }))} placeholder="Country" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          </div>
          <input value={draft.phone ?? ""} onChange={(e) => setDraft((v) => ({ ...v, phone: e.target.value }))} placeholder="Phone (optional)" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
          <label className="flex items-center gap-2 text-xs text-zinc-300">
            <input type="checkbox" checked={draft.is_default} onChange={(e) => setDraft((v) => ({ ...v, is_default: e.target.checked }))} />
            Set as default shipping address
          </label>
          {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">{error}</p>}
          {message && <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">{message}</p>}
          <button type="submit" disabled={saving} className="rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-2 text-sm font-semibold text-emerald-300 disabled:opacity-50">
            {saving ? "Saving..." : editingId ? "Save Address" : "Add Address"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setDraft(EMPTY_DRAFT);
              }}
              className="rounded-lg border border-zinc-700 px-3 py-2 text-sm font-semibold text-zinc-200"
            >
              Cancel edit
            </button>
          )}
        </form>
      </article>
    </section>
  );
}
