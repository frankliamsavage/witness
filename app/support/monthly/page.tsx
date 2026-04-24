import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Monthly Support",
  description: "Support the Witness Project with ongoing contributions.",
};

export default function MonthlySupportPage() {
  return (
    <main className="relative z-0 min-h-screen bg-gradient-to-b from-indigo-900 via-indigo-700 to-amber-200 text-white">
      <section className="mx-auto max-w-3xl px-6 py-16">

        <h1 className="text-4xl font-bold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(255,200,50,0.6)]">
          Monthly Support
        </h1>

        <p className="mt-6 leading-7">
          Thank you for believing in this mission. Monthly support helps sustain development,
          community tools, servers, outreach, and ongoing growth of the Witness Project.
        </p>

        <p className="mt-6 leading-7">
          More contribution options, perks, and supporter features will be added soon.
        </p>

        <div className="mt-12 text-sm text-white/80">
          <Link href="/support" className="hover:text-amber-300 underline">← Back to Support Options</Link>
          <span className="mx-2">|</span>
          <Link href="/" className="hover:text-amber-300 underline">← Return Home</Link>
        </div>

      </section>
    </main>
  );
}
