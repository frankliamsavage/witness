import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cookies Policy",
  description: "Cookie usage information for the Witness Project.",
};

export default function CookiesPage() {
  return (
    <main className="relative z-0 min-h-screen bg-gradient-to-b from-indigo-900 via-indigo-700 to-amber-200 text-white">
      <section className="mx-auto max-w-3xl px-6 py-16">

        <h1 className="text-4xl font-bold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(255,200,50,0.6)]">
          Cookies Policy
        </h1>

        <p className="mt-6 leading-7">
          This website may use cookies or similar technologies to improve user experience, monitor
          analytics, or support certain features. By continuing to use this site, you consent to any
          cookie usage as described.
        </p>

        <p className="mt-6 leading-7">
          Users may adjust their browser settings to block or manage cookies, though doing so may
          affect certain features or functionality.
        </p>

        <div className="mt-12 text-sm text-white/80">
          <Link href="/legal" className="hover:text-amber-300 underline">← Back to Legal Notices</Link>
          <span className="mx-2">|</span>
          <Link href="/" className="hover:text-amber-300 underline">← Return Home</Link>
        </div>

      </section>
    </main>
  );
}
