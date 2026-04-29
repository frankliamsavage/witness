import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DMCA Takedown Policy",
  description: "Witness Project DMCA copyright takedown and counter-notice policy.",
};

export default function DmcaPolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-16 sm:px-10">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-10">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Legal
          </p>
          <h1 className="text-3xl font-bold text-zinc-50 sm:text-4xl">DMCA Takedown Policy</h1>
          <p className="mt-3 text-sm text-zinc-300">Effective date: April 28, 2026</p>
        </section>

        <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8">
          <article>
            <h2 className="text-lg font-semibold text-emerald-300">1. Reporting Copyright Infringement</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              If you believe content on Witness Project infringes your copyright, submit a DMCA notice to:
            </p>
            <p className="mt-2 text-sm text-zinc-200">
              Email:{" "}
              <a
                href="mailto:WitnessProject.net@gmail.com"
                className="font-semibold text-emerald-300 underline decoration-emerald-500/50 underline-offset-4"
              >
                WitnessProject.net@gmail.com
              </a>
            </p>
            <p className="mt-2 text-sm text-zinc-300">
              You may also use our{" "}
              <Link href="/copyright-report" className="font-semibold text-emerald-300 hover:underline">
                Copyright Report Form
              </Link>
              .
            </p>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-emerald-300">2. Required Information for a Valid DMCA Notice</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-7 text-zinc-300">
              <li>Your full legal name and contact information (email, phone, mailing address).</li>
              <li>Description of the copyrighted work you claim has been infringed.</li>
              <li>Direct URL(s) or location of the allegedly infringing content on our platform.</li>
              <li>
                A statement: &quot;I have a good faith belief that use of the material is not authorized by the copyright
                owner, its agent, or the law.&quot;
              </li>
              <li>
                A statement: &quot;The information in this notice is accurate, and under penalty of perjury, I am the owner
                or authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.&quot;
              </li>
              <li>Your physical or electronic signature.</li>
            </ul>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-emerald-300">3. Counter-Notice Process</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              If your content was removed and you believe removal was a mistake or misidentification, you may submit a
              counter-notice with:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-7 text-zinc-300">
              <li>Your name, address, phone number, and email address.</li>
              <li>Identification of removed content and where it appeared before removal.</li>
              <li>
                A statement under penalty of perjury that you have a good faith belief the content was removed by mistake
                or misidentification.
              </li>
              <li>
                A statement consenting to jurisdiction of the federal court for your district (or Missouri if outside the
                U.S.) and that you will accept service of process from the original claimant.
              </li>
              <li>Your physical or electronic signature.</li>
            </ul>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-emerald-300">4. Good Faith and Accuracy</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              Submitting false claims or false counter-notices may create legal liability. Only submit notices you believe
              are truthful and legally valid.
            </p>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-emerald-300">5. Repeat Infringer Policy</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              Witness Project terminates accounts of repeat infringers in appropriate circumstances. Repeated valid claims
              may result in content removal, account suspension, or permanent termination.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
