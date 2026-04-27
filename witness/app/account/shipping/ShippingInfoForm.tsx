"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ShippingFormData = {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

export function ShippingInfoForm({ initialValues }: { initialValues: ShippingFormData }) {
  const [name, setName] = useState(initialValues.name);
  const [address, setAddress] = useState(initialValues.address);
  const [city, setCity] = useState(initialValues.city);
  const [state, setState] = useState(initialValues.state);
  const [zip, setZip] = useState(initialValues.zip);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setSaving(true);

    try {
      const supabase = createClient();
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        setError("Your session expired. Please log in again.");
        return;
      }

      const currentMeta = (userData.user.user_metadata ?? {}) as Record<string, unknown>;
      const nextMeta = {
        ...currentMeta,
        full_name: name.trim(),
        shipping_address: address.trim(),
        shipping_city: city.trim(),
        shipping_state: state.trim(),
        shipping_zip: zip.trim(),
      };

      const { error: updateError } = await supabase.auth.updateUser({ data: nextMeta });
      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save shipping details right now.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="mt-6 grid gap-4" onSubmit={onSave}>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-emerald-300">Full Name</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
          placeholder="Your full name"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-emerald-300">Street Address</span>
        <textarea
          required
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
          placeholder="Street and apartment/unit"
        />
      </label>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-emerald-300">City</span>
          <input
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
            placeholder="City"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-emerald-300">State</span>
          <input
            required
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
            placeholder="State"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-emerald-300">ZIP</span>
          <input
            required
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
            placeholder="ZIP"
          />
        </label>
      </div>

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>
      )}
      {saved && (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
          Shipping info saved. Checkout will auto-fill these details.
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Shipping Info"}
      </button>
    </form>
  );
}
