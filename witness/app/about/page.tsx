import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description: "Meet the founders and mission behind Witness Project.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:gap-10 sm:px-8 sm:py-16 lg:px-16">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6 shadow-2xl shadow-emerald-500/10 sm:p-12">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            About Witness Project
          </p>
          <h1 className="max-w-4xl text-2xl font-bold leading-tight text-zinc-50 sm:text-4xl">
            Built by Frank Savage to challenge corporate greed with transparent capitalism.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-300 sm:mt-5 sm:text-lg sm:leading-7">
            Witness Project is personal. It started as a response to systems that hide margins, exploit creators, and
            leave communities in the dark. This platform exists to make the economics visible and keep people, not
            corporations, at the center.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-xl font-semibold text-emerald-300">Founder photo</h2>
            <div className="relative mt-4 aspect-video overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950/90 p-1">
              <Image
                src="/founders-frank-toni.png"
                alt="Frank and Toni, founders of Witness Project"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
            </div>
            <p className="mt-3 text-sm font-semibold text-zinc-100">Frank & Toni — Founders</p>
          </article>

          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-xl font-semibold text-emerald-300">Founder story</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              I&apos;m Frank Savage. Witness Project is my way of proving that business can be profitable without becoming
              predatory. I want creators to see what they earn, customers to see where their money goes, and everyone
              involved to know the rules before they play the game.
            </p>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              This is not built to sound polished for investors. It&apos;s built to be honest for real people. Transparent
              pricing, creator participation, and visible systems are the core. We are here to build leverage for
              communities, not extract from them.
            </p>
            <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Mission</p>
              <p className="mt-2 text-sm text-zinc-100">
                Fight corporate greed by making capitalism transparent, accountable, and creator-aligned.
              </p>
            </div>
            <p className="mt-4">
              <Link
                href="/contact"
                className="inline-flex rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25"
              >
                Reach out directly
              </Link>
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
