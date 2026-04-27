import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Witness Project for partnerships, questions, or support.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-16 sm:px-10">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-10">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Contact
          </p>
          <h1 className="text-3xl font-bold text-zinc-50 sm:text-4xl">Questions? Want to partner? Reach out.</h1>
          <p className="mt-3 text-sm text-zinc-300">
            Email us anytime at <span className="font-semibold text-emerald-300">WitnessProject.net@gmail.com</span>.
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8">
          <ContactForm />
        </section>
      </main>
    </div>
  );
}
