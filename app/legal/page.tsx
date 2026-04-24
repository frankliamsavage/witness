import Link from "next/link";

export const metadata = {
  title: "Legal Notices",
  description: "Legal notices and governing policies for this website.",
};

export default function LegalIndexPage() {
  return (
    <main className="relative z-0 min-h-screen bg-gradient-to-b from-indigo-900 via-indigo-700 to-amber-200 text-white">
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(255,200,50,0.6)]">
          Legal Notices
        </h1>

        <p className="mt-6 leading-7">
          These legal notices outline the governing policies, responsibilities, and limitations
          associated with the use of this website and its services. By accessing or continuing to
          use this site, you acknowledge and agree to the terms, policies, and disclaimers listed
          within the sections linked below.
        </p>

        <h2 className="text-slate-200 text-xl font-semibold mt-10">Included Policies</h2>

        <ul className="list-disc pl-6 mt-4 space-y-2 text-white/90">
          <li>
            <Link href="/legal/disclaimer" className="hover:text-amber-300 underline">
              Legal Disclaimer
            </Link>
          </li>
          <li>
            <Link href="/terms" className="hover:text-amber-300 underline">
              Terms of Service
            </Link>
          </li>
          <li>
            <Link href="/privacy" className="hover:text-amber-300 underline">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link href="/legal/cookies" className="hover:text-amber-300 underline">
              Cookie Policy
            </Link>
          </li>
          <li>
            <Link href="/legal/coppa-terms" className="hover:text-amber-300 underline">
              COPPA Terms of Service
            </Link>
          </li>
        </ul>

        <p className="mt-10 leading-7">
          These policies are designed to set expectations, define permitted use, limit liability,
          and provide transparency. The interpretation and enforcement of these policies fall under
          the governance and sole discretion of the Witness Project and its designated authorities.
        </p>

        <Link
          href="/"
          className="mt-10 inline-block underline hover:text-amber-300"
        >
          ← Back Home
        </Link>
      </section>
    </main>
  );
}
