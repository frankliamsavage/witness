import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Legal Disclaimer",
  description: "General disclaimer for the Witness Project.",
};

export default function DisclaimerPage() {
  return (
    <main className="relative z-0 min-h-screen bg-gradient-to-b from-indigo-900 via-indigo-700 to-amber-200 text-white">
      <section className="mx-auto max-w-3xl px-6 py-16">

        {/* Title */}
        <h1 className="text-4xl font-bold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(255,200,50,0.6)]">
          Legal Disclaimer
        </h1>

        {/* Content */}
        <p className="mt-6 leading-7">
          All content on this website is provided for general informational, educational, or personal
          use only. While efforts are made to maintain accuracy, no guarantee is made concerning
          completeness, reliability, or suitability of any information provided.
        </p>

        <h2 className="text-slate-200 text-xl font-semibold mt-10">No Professional Advice</h2>
        <p className="mt-2 leading-7">
          Nothing on this site constitutes legal, financial, medical, or professional advice. Users
          are responsible for verifying information and consulting qualified professionals where
          appropriate.
        </p>

        <h2 className="text-slate-200 text-xl font-semibold mt-10">Limitation of Liability</h2>
        <p className="mt-2 leading-7">
          Under no circumstances shall this site, its operators, or affiliates be held liable for any
          loss, damage, or consequences arising from the use or misuse of information, services, or
          features found here.
        </p>

        <h2 className="text-slate-200 text-xl font-semibold mt-10">User Responsibility</h2>
        <p className="mt-2 leading-7">
          By using this website, you accept full responsibility for your actions and use of any
          content or functionality provided.
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
