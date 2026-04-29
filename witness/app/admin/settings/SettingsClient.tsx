"use client";

import { useState } from "react";
import type { SettingKey } from "@/lib/site-settings";

type SettingsState = Record<SettingKey, boolean>;

const LABELS: Record<SettingKey, string> = {
  stripe_payments_enabled: "Stripe Payments Enabled",
  site_maintenance_mode: "Site Maintenance Mode",
  new_design_submissions_enabled: "New Design Submissions Enabled",
  creator_payouts_enabled: "Creator Payouts Enabled",
  orders_enabled: "Orders Enabled",
};

export function SettingsClient({ initialSettings }: { initialSettings: SettingsState }) {
  const [settings, setSettings] = useState<SettingsState>(initialSettings);
  const [savingKey, setSavingKey] = useState<SettingKey | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const updateSetting = async (key: SettingKey, value: boolean) => {
    setSavingKey(key);
    setStatus(null);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) {
        setStatus(result.error ?? "Failed to save setting.");
        return;
      }

      setSettings((prev) => ({ ...prev, [key]: value }));
      setStatus(`${LABELS[key]} updated.`);
    } catch {
      setStatus("Network error while saving setting.");
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-emerald-300">Platform Toggles</h2>
      <p className="mt-2 text-sm text-zinc-300">
        Changes apply to production behavior and are stored in the database.
      </p>

      <div className="mt-6 space-y-3">
        {(Object.keys(settings) as SettingKey[]).map((key) => (
          <div key={key} className="flex items-center justify-between gap-3 rounded-xl border border-zinc-700 bg-zinc-950/70 p-3">
            <p className="text-sm font-semibold text-zinc-100">{LABELS[key]}</p>
            <button
              type="button"
              disabled={savingKey === key}
              onClick={() => updateSetting(key, !settings[key])}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60 ${
                settings[key]
                  ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30"
                  : "border-zinc-700 bg-zinc-900/80 text-zinc-200 hover:border-emerald-500/40 hover:text-emerald-300"
              }`}
            >
              {savingKey === key ? "Saving..." : settings[key] ? "Enabled" : "Disabled"}
            </button>
          </div>
        ))}
      </div>

      {status && <p className="mt-4 text-xs text-zinc-300">{status}</p>}
    </section>
  );
}
