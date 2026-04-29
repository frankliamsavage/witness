import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSupabasePublicConfig } from "@/lib/supabase/env";
import { SupabaseMissingConfigNotice } from "@/components/SupabaseMissingConfigNotice";
import { AccountSetupClient } from "./AccountSetupClient";

export const metadata: Metadata = {
  title: "Account Setup",
  description: "Finish your Witness account setup with customer profile and shipping details.",
};

type UserMeta = {
  full_name?: string;
  phone?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_zip?: string;
  shipping_country?: string;
  shipping_phone?: string;
};

export default async function AccountSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  if (!getSupabasePublicConfig()) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
          <SupabaseMissingConfigNotice className="p-4 text-amber-100" />
        </main>
      </div>
    );
  }

  const { next } = await searchParams;
  const nextPath = typeof next === "string" && next.startsWith("/") ? next : "/dashboard";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/login?next=/account/setup${nextPath ? `?next=${encodeURIComponent(nextPath)}` : ""}`);

  const { count } = await supabase
    .from("user_addresses")
    .select("id", { head: true, count: "exact" })
    .eq("user_id", user.id);
  const meta = (user.user_metadata ?? {}) as UserMeta;
  const hasProfile = Boolean(meta.full_name?.trim());
  if (hasProfile && (count ?? 0) > 0) {
    redirect(nextPath);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-12">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Finish setup
          </p>
          <h1 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">Finish setting up your account</h1>
          <p className="mt-4 text-sm leading-6 text-zinc-300 sm:text-base">
            Add your name and shipping address so checkout is faster next time. You can save multiple addresses and
            choose where each order ships.
          </p>
          <AccountSetupClient
            initialName={meta.full_name ?? ""}
            initialPhone={meta.phone ?? ""}
            nextPath={nextPath}
            initialAddress={{
              recipient_name: meta.full_name ?? "",
              address_line1: meta.shipping_address ?? "",
              address_line2: "",
              city: meta.shipping_city ?? "",
              state: meta.shipping_state ?? "",
              postal_code: meta.shipping_zip ?? "",
              country: meta.shipping_country ?? "United States",
              phone: meta.shipping_phone ?? meta.phone ?? "",
            }}
          />
        </section>
      </main>
    </div>
  );
}
