"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Address = {
  recipient_name: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
};

export function AccountSetupClient({
  initialName,
  initialPhone,
  initialAddress,
  nextPath,
}: {
  initialName: string;
  initialPhone: string;
  initialAddress: Address;
  nextPath: string;
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [address, setAddress] = useState(initialAddress);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = createClient();
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        setError("Your session expired. Please log in again.");
        return;
      }

      const { data: addressesResult, error: addressesError } = await supabase
        .from("user_addresses")
        .select("id")
        .eq("user_id", userData.user.id)
        .limit(1);
      if (addressesError) {
        setError(addressesError.message);
        return;
      }

      const meta = (userData.user.user_metadata ?? {}) as Record<string, unknown>;
      const { error: updateMetaError } = await supabase.auth.updateUser({
        data: {
          ...meta,
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          shipping_address: address.address_line1.trim(),
          shipping_city: address.city.trim(),
          shipping_state: address.state.trim(),
          shipping_zip: address.postal_code.trim(),
          shipping_country: address.country.trim() || "United States",
          shipping_phone: address.phone.trim() || null,
        },
      });
      if (updateMetaError) {
        setError(updateMetaError.message);
        return;
      }

      if (!addressesResult?.length) {
        const response = await fetch("/api/account/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            label: "Default",
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
        const result = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };
        if (!response.ok || !result.ok) {
          setError(result.error ?? "Unable to save default shipping address.");
          return;
        }
      }

      setMessage("Account setup saved.");
      router.push(nextPath || "/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save account setup.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-4">
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-emerald-300">Full name</span>
        <input
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/50"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-emerald-300">Phone (optional)</span>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/50"
        />
      </label>
      <p className="mt-2 text-sm font-semibold text-emerald-300">Default shipping address</p>
      <label className="grid gap-2">
        <span className="text-xs text-zinc-300">Recipient name</span>
        <input
          required
          value={address.recipient_name}
          onChange={(e) => setAddress((prev) => ({ ...prev, recipient_name: e.target.value }))}
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/50"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-xs text-zinc-300">Address line 1</span>
        <input
          required
          value={address.address_line1}
          onChange={(e) => setAddress((prev) => ({ ...prev, address_line1: e.target.value }))}
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/50"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-xs text-zinc-300">Address line 2 (optional)</span>
        <input
          value={address.address_line2}
          onChange={(e) => setAddress((prev) => ({ ...prev, address_line2: e.target.value }))}
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/50"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-xs text-zinc-300">City</span>
          <input
            required
            value={address.city}
            onChange={(e) => setAddress((prev) => ({ ...prev, city: e.target.value }))}
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/50"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-xs text-zinc-300">State</span>
          <input
            required
            value={address.state}
            onChange={(e) => setAddress((prev) => ({ ...prev, state: e.target.value }))}
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/50"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-xs text-zinc-300">ZIP/postal code</span>
          <input
            required
            value={address.postal_code}
            onChange={(e) => setAddress((prev) => ({ ...prev, postal_code: e.target.value }))}
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/50"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-xs text-zinc-300">Country</span>
          <input
            required
            value={address.country}
            onChange={(e) => setAddress((prev) => ({ ...prev, country: e.target.value }))}
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/50"
          />
        </label>
      </div>
      <label className="grid gap-2">
        <span className="text-xs text-zinc-300">Shipping phone (optional)</span>
        <input
          value={address.phone}
          onChange={(e) => setAddress((prev) => ({ ...prev, phone: e.target.value }))}
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/50"
        />
      </label>
      {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>}
      {message && <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">{message}</p>}
      <button
        type="submit"
        disabled={saving}
        className="rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Saving..." : "Finish account setup"}
      </button>
    </form>
  );
}
