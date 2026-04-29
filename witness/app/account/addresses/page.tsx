import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SupabaseMissingConfigNotice } from "@/components/SupabaseMissingConfigNotice";
import { createClient } from "@/lib/supabase/server";
import { getSupabasePublicConfig } from "@/lib/supabase/env";
import { AddressesClient } from "./AddressesClient";

export const metadata: Metadata = {
  title: "Address Book",
  description: "Manage saved shipping addresses for faster checkout.",
};

export default async function AccountAddressesPage() {
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
  if (!user) redirect("/login?next=/account/addresses");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-12">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Account
          </p>
          <h1 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">Address Book</h1>
          <p className="mt-4 text-sm leading-6 text-zinc-300 sm:text-base">
            Save multiple shipping addresses and choose where each order ships.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/checkout" className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200">
              Back to checkout
            </Link>
            <Link href="/dashboard" className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200">
              Back to dashboard
            </Link>
          </div>
        </section>
        <AddressesClient />
      </main>
    </div>
  );
}
