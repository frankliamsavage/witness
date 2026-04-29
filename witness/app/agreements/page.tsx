import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contributor Agreement",
  description: "Exclusive license contributor agreement for Witness creators.",
};

export default function AgreementsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-12">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Legal
          </p>
          <h1 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">
            Contributor Agreement (Exclusive License Model)
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            Effective date: April 28, 2026. This agreement governs creator design submissions to Witness Project.
          </p>
        </section>

        <section className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
          <article>
            <h2 className="text-lg font-semibold text-emerald-300">1. Parties and Scope</h2>
            <p className="mt-2 text-sm text-zinc-300">
              This Contributor Agreement is between Witness Project (&quot;Platform&quot;) and the creator submitting designs
              (&quot;Creator&quot;). It applies to all artwork, graphics, and design assets submitted by Creator and accepted by
              Platform for commercial use.
            </p>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-emerald-300">2. Ownership and Originality Warranty</h2>
            <p className="mt-2 text-sm text-zinc-300">
              Creator retains copyright ownership of submitted work. Creator represents and warrants that each submission
              is original, does not infringe any copyright, trademark, publicity, privacy, or other third-party right,
              and that Creator has full authority to grant the rights in this agreement.
            </p>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-emerald-300">3. Exclusive License Grant</h2>
            <p className="mt-2 text-sm text-zinc-300">
              For each accepted submission, Creator grants Platform an exclusive, worldwide, royalty-bearing,
              sublicensable license to reproduce, print, manufacture, advertise, distribute, display, and sell products
              using the design through all channels and media. During the term, Platform is the sole authorized seller of
              products using accepted designs.
            </p>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-emerald-300">4. Royalty Structure</h2>
            <p className="mt-2 text-sm text-zinc-300">
              Creator will receive royalties as a percentage of qualifying net sales revenue for licensed designs.
              Platform may use tiered royalty rates based on performance and may adjust tiers prospectively with notice.
              Current default tiers are:
            </p>
            <ul className="mt-3 grid gap-2 text-sm text-zinc-300 sm:grid-cols-2">
              <li className="rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 py-2">Launch: 10% ($0 - $1,000)</li>
              <li className="rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 py-2">
                Growth: 15% ($1,000 - $6,000)
              </li>
              <li className="rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 py-2">
                Scale: 20% ($6,000 - $12,000)
              </li>
              <li className="rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 py-2">
                Pro: 25% ($12,000 - $100,000)
              </li>
              <li className="rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 py-2">Elite: 30% ($100,000+)</li>
            </ul>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-emerald-300">5. Payment Terms</h2>
            <p className="mt-2 text-sm text-zinc-300">
              Royalties are calculated monthly and paid on a net-30 basis after month-end, provided the Creator account
              balance meets a minimum payout threshold of $25.00. Amounts below threshold roll forward to the next cycle.
              Platform may withhold payments for chargebacks, fraud investigations, tax/legal compliance, or unresolved
              ownership disputes.
            </p>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-emerald-300">6. Indemnification</h2>
            <p className="mt-2 text-sm text-zinc-300">
              Creator agrees to defend, indemnify, and hold harmless Platform, its owners, officers, employees, and
              affiliates from claims, damages, liabilities, losses, and expenses (including reasonable attorneys&apos; fees)
              arising from Creator submissions, including alleged infringement, misappropriation, or breach of this
              agreement.
            </p>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-emerald-300">7. Platform Moderation and Removal Rights</h2>
            <p className="mt-2 text-sm text-zinc-300">
              Platform may reject, suspend, de-list, or remove any content at any time, with or without cause, including
              for legal risk, policy concerns, quality control, or operational reasons.
            </p>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-emerald-300">8. Term and Termination</h2>
            <p className="mt-2 text-sm text-zinc-300">
              This agreement begins when Creator accepts it and continues until terminated by either party with written
              notice. Upon termination, Platform will stop new production/listing of terminated designs within a
              commercially reasonable period, but may sell remaining inventory and process returns. Royalty obligations
              for completed sales survive termination. Indemnification, accrued payment obligations, and dispute terms
              survive termination.
            </p>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-emerald-300">9. Governing Law</h2>
            <p className="mt-2 text-sm text-zinc-300">
              This agreement is governed by the laws of the State of Missouri, USA, without regard to conflict-of-law
              rules. Venue for disputes is in Missouri state or federal courts with proper jurisdiction.
            </p>
          </article>
        </section>

        <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
          <p className="text-sm text-zinc-100">
            Questions about this agreement can be sent to{" "}
            <a
              href="mailto:WitnessProject.net@gmail.com"
              className="font-semibold text-emerald-300 underline decoration-emerald-500/50 underline-offset-4"
            >
              WitnessProject.net@gmail.com
            </a>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/terms"
              className="inline-flex rounded-lg border border-zinc-700 bg-zinc-900/80 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
            >
              View Terms of Service
            </Link>
            <Link
              href="/dmca"
              className="inline-flex rounded-lg border border-zinc-700 bg-zinc-900/80 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
            >
              View DMCA Policy
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
