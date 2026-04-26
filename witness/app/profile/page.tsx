import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-12">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Creator Identity
          </p>
          <h1 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">Profile Builder</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            Build a distinct IP page for your brand. Customize visual style, introduce your story, and make your creator space feel original.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-lg font-semibold text-emerald-300">Brand visuals</h2>
            <p className="mt-2 text-sm text-zinc-300">
              Upload a profile image, banner, and custom background to make your IP page instantly recognizable.
            </p>
            <button className="mt-4 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300">
              Edit visuals
            </button>
          </article>
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-lg font-semibold text-emerald-300">Creator bio</h2>
            <p className="mt-2 text-sm text-zinc-300">
              Add your mission, influences, and the story behind your designs so fans understand your brand.
            </p>
            <button className="mt-4 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300">
              Edit bio
            </button>
          </article>
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-lg font-semibold text-emerald-300">Public links</h2>
            <p className="mt-2 text-sm text-zinc-300">
              Add social links, website links, and portfolio destinations to route traffic to your full ecosystem.
            </p>
            <button className="mt-4 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300">
              Manage links
            </button>
          </article>
        </section>

        <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
          <p className="text-sm font-semibold text-emerald-300">Next step</p>
          <p className="mt-2 text-sm text-zinc-100">
            Profile editing controls are scaffolded. Next implementation phase is connecting these controls to Supabase storage and profile tables.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/agreements"
              className="inline-flex rounded-lg border border-emerald-500/40 bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition-colors hover:bg-emerald-500/30"
            >
              Open agreements
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex rounded-lg border border-zinc-700 bg-zinc-900/80 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
            >
              Back to dashboard
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
