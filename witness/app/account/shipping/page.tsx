import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SupabaseMissingConfigNotice } from "@/components/SupabaseMissingConfigNotice";
import { createClient } from "@/lib/supabase/server";
import { getSupabasePublicConfig } from "@/lib/supabase/env";
import { ShippingInfoForm } from "./ShippingInfoForm";

export const metadata: Metadata = {
  title: "Shipping Info",
  description: "Save shipping details to speed up checkout on Witness.",
};

type UserMeta = {
  screen_name?: string;
  full_name?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_zip?: string;
};

export default async function ShippingInfoPage() {
  if (!getSupabasePublicConfig()) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
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
    redirect("/login?next=/account/shipping");
  }

  const meta = (user.user_metadata ?? {}) as UserMeta;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-12">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Account
          </p>
          <h1 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">Shipping Information</h1>
          <p className="mt-4 text-sm leading-6 text-zinc-300 sm:text-base">
            Save your shipping details once, and checkout will auto-fill them every time.
          </p>

          <ShippingInfoForm
            initialValues={{
              name: meta.full_name ?? meta.screen_name ?? "",
              address: meta.shipping_address ?? "",
              city: meta.shipping_city ?? "",
              state: meta.shipping_state ?? "",
              zip: meta.shipping_zip ?? "",
            }}
          />
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/checkout"
              className="inline-flex rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition-colors hover:bg-emerald-500/25"
            >
              Back to checkout
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex rounded-lg border border-zinc-700 bg-zinc-900/80 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
            >
              Back to dashboard
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
