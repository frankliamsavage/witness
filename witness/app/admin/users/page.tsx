import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SupabaseMissingConfigNotice } from "@/components/SupabaseMissingConfigNotice";
import { getSupabasePublicConfig } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { UsersClient } from "./UsersClient";

export const metadata: Metadata = {
  title: "User Data Management",
  description: "Admin-only user account management tools.",
};

type UserMeta = { role?: string };

function isAdmin(role: string | undefined) {
  return role?.toLowerCase() === "admin";
}

export default async function AdminUsersPage() {
  if (!getSupabasePublicConfig()) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
          <SupabaseMissingConfigNotice className="p-4 text-amber-100" />
        </main>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/users");
  const meta = (user.user_metadata ?? {}) as UserMeta;
  if (!isAdmin(meta.role)) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-12">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Admin
          </p>
          <h1 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">User Data Management</h1>
          <p className="mt-4 text-sm text-zinc-300">Manage account roles, status, notes, and safety actions for registered users.</p>
          <div className="mt-4">
            <Link href="/admin/settings" className="inline-flex rounded-lg border border-zinc-700 bg-zinc-900/80 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300">
              Back to Admin Settings
            </Link>
          </div>
        </section>

        <UsersClient />
      </main>
    </div>
  );
}
