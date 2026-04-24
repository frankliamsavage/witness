import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description: "How we collect, use, and protect information on this website.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="relative z-0 min-h-screen bg-gradient-to-b from-indigo-900 via-indigo-700 to-amber-200 text-white">
      <section className="mx-auto max-w-3xl px-6 py-16">
        {/* Title */}
        <h1 className="text-4xl font-bold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(255,200,50,0.6)]">
          Privacy Policy
        </h1>

        <p className="mt-6 leading-7">
          This Privacy Policy explains how we collect, use, disclose, and safeguard information
          when you visit or interact with this website. By using the site, you consent to the
          practices described here.
        </p>

        {/* 1 */}
        <h2 className="mt-10 text-xl font-semibold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          1. Information We Collect
        </h2>
        <p className="mt-2 leading-7">
          We may collect information you voluntarily provide (e.g., name, email, messages) and
          technical data automatically (e.g., IP address, device/browser type, pages visited,
          timestamps). If accounts or forms exist, we collect the data you submit through them.
        </p>

        {/* 2 */}
        <h2 className="mt-10 text-xl font-semibold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          2. How We Use Information
        </h2>
        <p className="mt-2 leading-7">
          We use information to operate and improve the site, communicate with you, customize
          experiences, ensure security, comply with applicable laws, and understand aggregate
          usage patterns. We do not sell personal information.
        </p>

        {/* 3 */}
        <h2 className="mt-10 text-xl font-semibold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          3. Sharing & Disclosure
        </h2>
        <p className="mt-2 leading-7">
          We may share information with service providers that help us operate the site (e.g.,
          hosting, analytics, email). We may also disclose information to comply with law,
          enforce policies, or protect rights, safety, and property. We do not sell personal data.
        </p>

        {/* 4 */}
        <h2 className="mt-10 text-xl font-semibold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          4. Data Security
        </h2>
        <p className="mt-2 leading-7">
          We take reasonable measures to protect information from unauthorized access, disclosure,
          alteration, or destruction. However, no method of transmission or storage is completely
          secure; use the site at your own discretion.
        </p>

        {/* 5 */}
        <h2 className="mt-10 text-xl font-semibold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          5. Data Retention
        </h2>
        <p className="mt-2 leading-7">
          We retain information for as long as necessary to fulfill the purposes described in this
          Policy, unless a longer retention period is required or permitted by law.
        </p>

        {/* 6 */}
        <h2 className="mt-10 text-xl font-semibold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          6. Your Choices & Rights
        </h2>
        <p className="mt-2 leading-7">
          Where applicable, you may request access, correction, or deletion of your personal
          information, and you may opt out of non-essential communications. To make a request,
          contact us using the email below.
        </p>

        {/* 7 */}
        <h2 className="mt-10 text-xl font-semibold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          7. Third-Party Services
        </h2>
        <p className="mt-2 leading-7">
          Our site may include links or integrations with third-party websites or services (such as
          payment processors or analytics). Their privacy practices are governed by their own
          policies, which we do not control.
        </p>

        {/* 8 */}
        <h2 className="mt-10 text-xl font-semibold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          8. Children’s Privacy
        </h2>
        <p className="mt-2 leading-7">
          This site is not directed to children under the age required by applicable law. We do not
          knowingly collect personal information from children. If we learn we have collected such
          information, we will take reasonable steps to delete it.
        </p>

        {/* 9 */}
        <h2 className="mt-10 text-xl font-semibold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          9. Changes to This Policy
        </h2>
        <p className="mt-2 leading-7">
          We may update this Policy from time to time. The “Last Updated” date will reflect the
          latest revision. Your continued use of the site after changes take effect constitutes
          acceptance of the updated Policy.
        </p>

        {/* 10 */}
        <h2 className="mt-10 text-xl font-semibold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          10. Contact
        </h2>
        <p className="mt-2 leading-7">
          For questions or requests regarding this Policy, contact{" "}
          <a href="mailto:witnessprojecthelp@gmail.com" className="underline hover:text-amber-300">
            witnessprojecthelp@gmail.com
          </a>.
        </p>

        {/* Footer Navigation */}
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
