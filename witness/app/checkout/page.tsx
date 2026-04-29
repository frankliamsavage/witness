import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { SupabaseMissingConfigNotice } from "@/components/SupabaseMissingConfigNotice";
import { getSupabasePublicConfig } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { CheckoutClient } from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Review your cart and complete checkout on Witness.",
};

type UserMeta = {
  screen_name?: string;
  full_name?: string;
  phone?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_zip?: string;
};

export default async function CheckoutPage() {
  if (!getSupabasePublicConfig()) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
          <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-12">
            <SupabaseMissingConfigNotice className="p-4 text-amber-100" />
          </section>
        </main>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/checkout");
  }

  const meta = (user.user_metadata ?? {}) as UserMeta;
  const { data: addresses } = await supabase
    .from("user_addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });
  const hasSetup = Boolean(meta.full_name?.trim()) && Boolean((addresses?.length ?? 0) > 0);
  if (!hasSetup) {
    redirect("/account/setup?next=/checkout");
  }
  const initialCustomer = {
    name: meta.full_name ?? meta.screen_name ?? "",
    email: user.email ?? "",
    phone: meta.phone ?? "",
  };

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
          <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
            <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-12">
              <p className="text-sm text-zinc-300">Loading checkout...</p>
            </section>
          </main>
        </div>
      }
    >
      <CheckoutClient initialCustomer={initialCustomer} initialAddresses={addresses ?? []} />
    </Suspense>
  );
}
