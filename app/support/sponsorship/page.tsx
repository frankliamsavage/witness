import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sponsorship Support",
  description: "Become a sponsor and support the Witness Project.",
};

export default function SponsorshipSupportPage() {
  return (
    <main className="relative z-0 min-h-screen bg-gradient-to-b from-indigo-900 via-indigo-700 to-amber-200 text-white">
      <section className="mx-auto max-w-3xl px-6 py-16">

        <h1 className="text-4xl font-bold bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(255,200,50,0.6)]">
          Sponsorship Support
        </h1>

        <p className="mt-6 leading-7">
          Sponsorship support helps move the Witness Project forward in powerful ways — from outreach,
          development, community support, and mission growth. Sponsor benefits and recognition options
          will be added as the platform continues to evolve.
        </p>

        <p className="mt-6 leading-7">
          Your belief, participation, and support are deeply appreciated. This project is built with
          purpose, and those who stand with it will be remembered and honored.
        </p>

        <div className="mt-12 text-sm text-white/80">
          <Link href="/support" className="hover:text-amber-300 underline">
            ← Back to Support Options
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
