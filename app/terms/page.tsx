import Link from "next/link";

export const metadata = {
  title: "Terms of Service",
  description: "Rules and conditions governing the use of this website.",
};

export default function TermsOfServicePage() {
  return (
    <main className="relative z-0 min-h-screen bg-gradient-to-b from-indigo-900 via-indigo-700 to-amber-200 text-white">
      <section className="mx-auto max-w-3xl px-6 py-16">
        {/* Title */}
        <h1 className="text-4xl font-bold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(255,200,50,0.6)]">
          Terms of Service
        </h1>

        {/* Intro */}
        <p className="mt-6 leading-7">
          Please read these Terms of Service (“Terms”) carefully. We are committed to
          transparency, fairness, and ethical stewardship of this platform. By accessing or
          using this site, you agree to be bound by these Terms. If you do not agree, please
          discontinue use.
        </p>

        {/* 1 */}
        <h2 className="mt-10 text-xl font-semibold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          1. Acceptance of Terms
        </h2>
        <p className="mt-2 leading-7">
          Your access to and use of this website constitutes your agreement to these Terms and
          to any policies referenced herein (including the Privacy Policy, Cookie Policy, and
          Legal Disclaimer). You represent that you have the legal capacity to enter into these
          Terms in your jurisdiction.
        </p>

        {/* 2 */}
        <h2 className="mt-10 text-xl font-semibold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          2. Changes to Terms
        </h2>
        <p className="mt-2 leading-7">
          We may update these Terms from time to time to reflect changes in law, services, or
          policies. The “Last Updated” date will indicate the latest revision. Continued use of
          the site after changes become effective constitutes acceptance of the updated Terms.
        </p>

        {/* 3 */}
        <h2 className="mt-10 text-xl font-semibold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          3. Eligibility & User Responsibilities
        </h2>
        <p className="mt-2 leading-7">
          You agree to use the site lawfully, to respect other users, and to refrain from any
          conduct that could harm the platform or community. If you create an account, you are
          responsible for maintaining the confidentiality of your credentials and for all
          activities under your account.
        </p>

        {/* 4 */}
        <h2 className="mt-10 text-xl font-semibold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          4. Acceptable Use
        </h2>
        <p className="mt-2 leading-7">
          You may not use the site to harass, abuse, defame, infringe, impersonate, spam,
          probe, or disrupt services; upload malware or harmful code; scrape, mine, or
          reverse-engineer where prohibited; or engage in unlawful activities in any
          jurisdiction.
        </p>

        {/* 5 */}
        <h2 className="mt-10 text-xl font-semibold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          5. Prohibited Conduct
        </h2>
        <p className="mt-2 leading-7">
          Prohibited activities include (without limitation): attempting unauthorized access;
          interfering with security features; misrepresenting affiliation; collecting personal
          data without consent; automated access that degrades service; and any action that
          violates these Terms or applicable law.
        </p>

        {/* 6 */}
        <h2 className="mt-10 text-xl font-semibold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          6. Intellectual Property
        </h2>
        <p className="mt-2 leading-7">
          All content, trademarks, logos, and materials on this site are owned by or licensed to
          the site operator and protected by applicable intellectual property laws. You receive a
          limited, non-exclusive, non-transferable license to access and use the site for lawful
          personal or organizational purposes, subject to these Terms.
        </p>

        {/* 7 */}
        <h2 className="mt-10 text-xl font-semibold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          7. Third-Party Links & Services
        </h2>
        <p className="mt-2 leading-7">
          The site may reference or link to third-party services. We are not responsible for the
          content, policies, or practices of third parties. Accessing third-party resources is at
          your own discretion and subject to their terms and policies.
        </p>

        {/* 8 */}
        <h2 className="mt-10 text-xl font-semibold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          8. Disclaimers
        </h2>
        <p className="mt-2 leading-7">
          The site is provided “as is” and “as available,” without warranties of any kind, whether
          express or implied, including but not limited to warranties of merchantability, fitness
          for a particular purpose, and non-infringement. We do not warrant uninterrupted or
          error-free operation.
        </p>

        {/* 9 */}
        <h2 className="mt-10 text-xl font-semibold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          9. Limitation of Liability
        </h2>
        <p className="mt-2 leading-7">
          To the fullest extent permitted by law, the site operator and its affiliates shall not be
          liable for any indirect, incidental, special, consequential, or punitive damages, or any
          loss of profits, data, or goodwill arising from your use of or inability to use the site.
          Some jurisdictions do not allow certain limitations; in such cases, our liability shall be
          limited to the maximum extent permitted by law.
        </p>

        {/* 10 */}
        <h2 className="mt-10 text-xl font-semibold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          10. Indemnification
        </h2>
        <p className="mt-2 leading-7">
          You agree to indemnify, defend, and hold harmless the site operator and its affiliates
          from and against any claims, liabilities, damages, losses, and expenses (including
          reasonable attorneys’ fees) arising out of or in any way connected with your breach of
          these Terms or misuse of the site.
        </p>

        {/* 11 */}
        <h2 className="mt-10 text-xl font-semibold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          11. Termination
        </h2>
        <p className="mt-2 leading-7">
          We may suspend or terminate access to the site at any time, with or without notice, if we
          believe you have violated these Terms or applicable law, or to protect the integrity and
          safety of the platform or its community.
        </p>

        {/* 12 */}
        <h2 className="mt-10 text-xl font-semibold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          12. Governing Law (Missouri)
        </h2>
        <p className="mt-2 leading-7">
          These Terms are governed by and construed in accordance with the laws of the State of
          Missouri, without regard to its conflict of laws principles.
        </p>

        {/* 13 */}
        <h2 className="mt-10 text-xl font-semibold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          13. Dispute Resolution & Venue
        </h2>
        <p className="mt-2 leading-7">
          You agree that any dispute arising out of or relating to these Terms or the site shall be
          brought exclusively in the state or federal courts located in Missouri, and you consent to
          the jurisdiction and venue of such courts.
        </p>

        {/* 14 */}
        <h2 className="mt-10 text-xl font-semibold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          14. Severability
        </h2>
        <p className="mt-2 leading-7">
          If any provision of these Terms is held to be invalid or unenforceable, the remaining
          provisions shall remain in full force and effect.
        </p>

        {/* 15 */}
        <h2 className="mt-10 text-xl font-semibold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          15. No Waiver
        </h2>
        <p className="mt-2 leading-7">
          Our failure to enforce any right or provision of these Terms shall not be deemed a waiver
          of such right or provision.
        </p>

        {/* 16 */}
        <h2 className="mt-10 text-xl font-semibold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          16. Entire Agreement
        </h2>
        <p className="mt-2 leading-7">
          These Terms, together with the policies referenced herein, constitute the entire agreement
          between you and the site operator regarding your use of the site.
        </p>

        {/* 17 */}
        <h2 className="mt-10 text-xl font-semibold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          17. Contact
        </h2>
        <p className="mt-2 leading-7">
          For questions about these Terms, please contact us at{" "}
          <a href="mailto:witnessprojecthelp@gmail.com" className="underline hover:text-amber-300">
            witnessprojecthelp@gmail.com
          </a>.
        </p>

        {/* Closing */}
        <p className="mt-10 leading-7">
          We are committed to operating with integrity, clarity, and mutual respect. Thank you for
          helping us maintain a safe, accountable, and constructive environment for everyone.
        </p>

        {/* Footer Navigation (unified) */}
        <div className="mt-12 text-sm text-white/80">
          <Link href="/legal" className="hover:text-amber-300 underline">
            ← Back to Legal Notices
          </Link>
          <span className="mx-2">|</span>
          <Link href="/" className="hover:text-amber-300 underline">
            ← Return Home
          </Link>
        </div>
      </section>
    </main>
  );
}
