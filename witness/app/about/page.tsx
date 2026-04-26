import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 sm:px-10 lg:px-16">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-12">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            About Witness Project
          </p>
          <h1 className="max-w-4xl text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">
            Built by Frank Savage to challenge corporate greed with transparent capitalism.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            Witness Project is personal. It started as a response to systems that hide margins, exploit creators, and
            leave communities in the dark. This platform exists to make the economics visible and keep people, not
            corporations, at the center.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-xl font-semibold text-emerald-300">Founder photo</h2>
            <div className="mt-4 flex h-72 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950/80 text-sm text-zinc-400">
              Add Frank&apos;s photo here
            </div>
            <p className="mt-3 text-xs text-zinc-400">
              Placeholder block is live now. Replace with your real image when ready.
            </p>
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
