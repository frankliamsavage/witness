"use client";

import { useState } from "react";
import Link from "next/link";
import { useEffect } from "react";
import type { SettingKey } from "@/lib/site-settings";

type Category = "T-Shirts" | "3D Prints";
type AgreementType = "Royalty" | "One-Time";

const REVENUE_ROYALTY_TIERS = [
  { name: "Launch", ratePercent: 10, revenueRange: "$0 - $1,000" },
  { name: "Growth", ratePercent: 15, revenueRange: "$1,000 - $6,000" },
  { name: "Scale", ratePercent: 20, revenueRange: "$6,000 - $12,000" },
  { name: "Pro", ratePercent: 25, revenueRange: "$12,000 - $100,000" },
  { name: "Elite", ratePercent: 30, revenueRange: "$100,000+" },
];

export default function SubmitDesignPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("T-Shirts");
  const [agreementType, setAgreementType] = useState<AgreementType>("Royalty");
  const [oneTimeOfferPrice, setOneTimeOfferPrice] = useState("");
  const [imageName, setImageName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submissionsEnabled, setSubmissionsEnabled] = useState(true);
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
          setSubmissionsEnabled(settings.new_design_submissions_enabled !== false);
          setMaintenanceMode(settings.site_maintenance_mode === true);
        }
      } catch {
        if (!cancelled) {
          setSubmissionsEnabled(true);
          setMaintenanceMode(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageName(file?.name ?? "");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionsEnabled || maintenanceMode) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-12">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Creator Submission
          </p>
          <h1 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">Submit Your Design</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
            Share your artwork or product idea for review. Submissions start as pending and move through moderation: pending, approved, or rejected.
          </p>
        </section>

        <form onSubmit={onSubmit} className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8">
          {(!submissionsEnabled || maintenanceMode) && (
            <p className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
              Submissions are temporarily unavailable. Please check back soon.
            </p>
          )}
          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-emerald-300">Design title</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={!submissionsEnabled || maintenanceMode}
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                placeholder="Ex: Transparent City Grid"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-emerald-300">Description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={!submissionsEnabled || maintenanceMode}
                rows={4}
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                placeholder="Describe your concept, style, and why it fits Witness."
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-emerald-300">Category</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  disabled={!submissionsEnabled || maintenanceMode}
                  className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                >
                  <option value="T-Shirts">T-Shirts</option>
                  <option value="3D Prints">3D Prints</option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-emerald-300">Agreement type</span>
                <select
                  value={agreementType}
                  onChange={(e) => setAgreementType(e.target.value as AgreementType)}
                  disabled={!submissionsEnabled || maintenanceMode}
                  className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                >
                  <option value="Royalty">Royalty</option>
                  <option value="One-Time">One-Time</option>
                </select>
              </label>
            </div>

            <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <p className="text-sm font-semibold text-emerald-300">Royalty Tier</p>
              <p className="mt-2 text-sm text-zinc-100">
                Royalty rates are based on total gross revenue and increase through progressive tiers.
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                {REVENUE_ROYALTY_TIERS.map((tier) => (
                  <div key={tier.name} className="rounded-lg border border-zinc-700 bg-zinc-950/70 p-3">
                    <p className="text-xs uppercase tracking-wide text-zinc-400">{tier.name}</p>
                    <p className="mt-1 text-lg font-bold text-emerald-300">{tier.ratePercent}%</p>
                    <p className="mt-1 text-xs text-zinc-300">{tier.revenueRange}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-zinc-300">
                Progressive tiers apply only to revenue earned inside each range.
              </p>
              {agreementType === "One-Time" && (
                <p className="mt-2 text-xs text-zinc-300">
                  One-time deals use fixed payout terms. Royalties apply only to Royalty agreements.
                </p>
              )}
            </section>

            {agreementType === "One-Time" && (
              <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-emerald-300">Your one-time offer price (USD)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={oneTimeOfferPrice}
                    onChange={(e) => setOneTimeOfferPrice(e.target.value)}
                    disabled={!submissionsEnabled || maintenanceMode}
                    placeholder="Ex: 500.00"
                    className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                  />
                  <p className="text-xs text-zinc-300">
                    You can name your offer, but final acceptance depends on artwork quality, audience pull, and brand fit.
                  </p>
                </label>
                <p className="mt-3 text-xs leading-5 text-zinc-300">
                  Leonardo da Vinci was one of history&apos;s greatest artists, yet he died poor partly because his era lacked
                  modern networking and distribution. In today&apos;s market, both artwork quality and artist infamy influence
                  whether Witness accepts your offer as-is or returns a counteroffer. Final payout is only completed after
                  licensing and fee terms are reviewed and signed.
                </p>
              </section>
            )}

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-emerald-300">Image upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                disabled={!submissionsEnabled || maintenanceMode}
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-500/20 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-emerald-300"
              />
              {imageName && <p className="text-xs text-zinc-400">Selected file: {imageName}</p>}
            </label>

            <button
              type="submit"
              disabled={!submissionsEnabled || maintenanceMode}
              className="mt-2 inline-flex w-full items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Submit Design
            </button>
          </div>
        </form>

        {submitted && (
          <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <p className="text-sm font-semibold text-emerald-300">Submission received</p>
            <p className="mt-1 text-sm text-zinc-200">
              Your design has been queued with status <span className="font-semibold">pending</span>. You will see updates when moderation changes it to approved or rejected.
            </p>
            <p className="mt-3">
              <Link
                href="/submitted-designs"
                className="inline-flex rounded-lg border border-emerald-500/40 bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition-colors hover:bg-emerald-500/30"
              >
                Go to submitted designs
              </Link>
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
