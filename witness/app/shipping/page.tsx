import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Witness Project shipping timelines, options, and return policy.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10 sm:px-8 sm:py-16 lg:px-16">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6 shadow-2xl shadow-emerald-500/10 sm:p-12">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Policy
          </p>
          <h1 className="text-2xl font-bold leading-tight text-zinc-50 sm:text-4xl">
            Witness Project Shipping Policy
          </h1>
          <p className="mt-4 text-sm leading-6 text-zinc-300 sm:text-base">
            We are a small business based in Missouri. We keep shipping simple, transparent, and clear.
          </p>
        </section>

        <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
          <h2 className="text-lg font-semibold text-emerald-300">Production Time</h2>
          <p className="text-sm text-zinc-300">Orders typically ship within 5-7 business days.</p>
        </section>

        <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
          <h2 className="text-lg font-semibold text-emerald-300">Shipping Options</h2>
          <ul className="space-y-2 text-sm text-zinc-300">
            <li className="rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 py-2">
              Standard Shipping (5-7 days): <span className="font-semibold text-zinc-100">$5.99</span>
            </li>
            <li className="rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 py-2">
              Priority Shipping (2-3 days): <span className="font-semibold text-zinc-100">$9.99</span>
            </li>
            <li className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-emerald-200">
              Free standard shipping on orders over $50.
            </li>
          </ul>
        </section>

        <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
          <h2 className="text-lg font-semibold text-emerald-300">Taxes</h2>
          <p className="text-sm text-zinc-300">
            No tax is added at checkout. We are a small Missouri business, and Missouri law allows this for
            qualifying small sellers.
          </p>
        </section>

        <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
          <h2 className="text-lg font-semibold text-emerald-300">Tracking</h2>
          <p className="text-sm text-zinc-300">All orders include a tracking number.</p>
        </section>

        <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
          <h2 className="text-lg font-semibold text-emerald-300">Returns</h2>
          <p className="text-sm text-zinc-300">We accept returns within 30 days for defects only.</p>
        </section>

        <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
          <h2 className="text-lg font-semibold text-emerald-300">Questions</h2>
          <p className="text-sm text-zinc-300">
            Contact us any time at{" "}
            <a
              href="mailto:WitnessProject.net@gmail.com"
              className="font-semibold text-emerald-300 underline decoration-emerald-500/50 underline-offset-4"
            >
              WitnessProject.net@gmail.com
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
