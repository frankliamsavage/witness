import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Platform terms of service for Witness Project users and creators.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-16 sm:px-10">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-10">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Legal
          </p>
          <h1 className="text-3xl font-bold text-zinc-50 sm:text-4xl">Terms of Service</h1>
          <p className="mt-3 text-sm text-zinc-300">Effective date: April 26, 2026</p>
        </section>

        <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8">
          <article>
            <h2 className="text-lg font-semibold text-emerald-300">1. Acceptance and Eligibility</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              By accessing or using Witness Project, you agree to these Terms of Service. If you do not agree, do not use
              the platform. You represent that you are legally able to enter a binding contract.
            </p>
          </article>
          <article>
            <h2 className="text-lg font-semibold text-emerald-300">2. User Responsibilities</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              You are responsible for your account credentials, account activity, submitted content, shipping/payment
              details, and compliance with applicable law. You must provide accurate information and keep it current.
            </p>
          </article>
          <article>
            <h2 className="text-lg font-semibold text-emerald-300">3. Prohibited Content and Conduct</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              You may not upload, sell, or promote content that infringes copyrights, trademarks, rights of publicity, or
              other rights. You may not upload unlawful, fraudulent, abusive, hateful, deceptive, or malicious content, or
              attempt to disrupt platform operations.
            </p>
          </article>
          <article>
            <h2 className="text-lg font-semibold text-emerald-300">4. Creator Submissions and Listings</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              Submission does not guarantee listing, acceptance, or compensation. Platform may review, reject, remove, or
              delist content at any time. Additional creator terms may apply through a Contributor Agreement.
            </p>
          </article>
          <article>
            <h2 className="text-lg font-semibold text-emerald-300">5. Purchases, Pricing, and Fulfillment</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              Product availability, pricing, royalties, and shipping terms may change. Orders may be canceled or refunded
              for fraud, inventory issues, legal risk, or technical error.
            </p>
          </article>
          <article>
            <h2 className="text-lg font-semibold text-emerald-300">6. Account Suspension and Termination</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              Platform may suspend, restrict, or terminate any account or remove content for violations of these Terms,
              repeat infringement, fraud risk, legal requests, or protection of platform users and operations.
            </p>
          </article>
          <article>
            <h2 className="text-lg font-semibold text-emerald-300">7. DMCA and Copyright Policy</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              Platform responds to copyright claims under the U.S. Digital Millennium Copyright Act (DMCA). See our{" "}
              <Link href="/dmca" className="font-semibold text-emerald-300 hover:underline">
                DMCA Takedown Policy
              </Link>{" "}
              and{" "}
              <Link href="/copyright-report" className="font-semibold text-emerald-300 hover:underline">
                Copyright Report Form
              </Link>
              .
            </p>
          </article>
          <article>
            <h2 className="text-lg font-semibold text-emerald-300">8. Limitation of Liability</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              To the fullest extent permitted by law, Platform and its affiliates are not liable for indirect, incidental,
              special, consequential, or punitive damages, or loss of profits, data, goodwill, or business interruption.
              Platform&apos;s aggregate liability for any claim will not exceed the amount paid by you to Platform in the
              twelve months before the claim.
            </p>
          </article>
          <article>
            <h2 className="text-lg font-semibold text-emerald-300">9. Disclaimer of Warranties</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              Services are provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, express or implied,
              including merchantability, fitness for a particular purpose, title, and non-infringement.
            </p>
          </article>
          <article>
            <h2 className="text-lg font-semibold text-emerald-300">10. Dispute Resolution</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              Before filing formal claims, parties agree to attempt informal resolution by contacting
              WitnessProject.net@gmail.com. If unresolved, disputes will be handled in state or federal courts located in
              Missouri, unless otherwise required by law.
            </p>
          </article>
          <article>
            <h2 className="text-lg font-semibold text-emerald-300">11. Governing Law</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              These Terms are governed by the laws of Missouri, USA, excluding conflict-of-law principles.
            </p>
          </article>
          <article>
            <h2 className="text-lg font-semibold text-emerald-300">12. Changes to Terms</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              Platform may update these Terms at any time. Updated terms are effective when posted. Continued use after
              posting means acceptance of revised terms.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
