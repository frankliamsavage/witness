import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SupabaseMissingConfigNotice } from "@/components/SupabaseMissingConfigNotice";
import { getAllSiteSettings } from "@/lib/site-settings";
import { getSupabasePublicConfig } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { SettingsClient } from "./SettingsClient";

export const metadata: Metadata = {
  title: "Admin Settings",
  description: "Admin-only platform settings and payment controls.",
};

type UserMeta = {
  role?: string;
};

function isAdmin(role: string | undefined) {
  return role?.toLowerCase() === "admin";
}

export default async function AdminSettingsPage() {
  if (!getSupabasePublicConfig()) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
          <SupabaseMissingConfigNotice className="p-4 text-amber-100" />
        </main>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin/settings");
  }

  const meta = (user.user_metadata ?? {}) as UserMeta;
  if (!isAdmin(meta.role)) {
    redirect("/dashboard");
  }

  const settings = await getAllSiteSettings();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-12">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Admin
          </p>
          <h1 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">Settings</h1>
          <p className="mt-4 text-sm text-zinc-300">Admin-only controls for payments, orders, submissions, and maintenance.</p>
        </section>

        <SettingsClient initialSettings={settings} />
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
          <p className="text-sm font-semibold text-emerald-300">User Management</p>
          <p className="mt-2 text-sm text-zinc-300">Open admin user account tools for role/status and maintenance actions.</p>
          <Link
            href="/admin/users"
            className="mt-4 inline-flex rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition-colors hover:bg-emerald-500/25"
          >
            Open User Data Management
          </Link>
        </section>
      </main>
    </div>
  );
}
