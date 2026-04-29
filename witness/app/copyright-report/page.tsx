import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Copyright Report Form",
  description: "Submit a copyright infringement report to Witness Project.",
};

export default function CopyrightReportPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-16 sm:px-10">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-10">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Legal
          </p>
          <h1 className="text-3xl font-bold text-zinc-50 sm:text-4xl">Copyright Report Form</h1>
          <p className="mt-3 text-sm text-zinc-300">
            Complete this form to submit a copyright complaint under U.S. DMCA standards.
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8">
          <form className="grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-emerald-300">1. Name</span>
              <input
                type="text"
                required
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                placeholder="Your full legal name"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-emerald-300">2. Contact Information</span>
              <textarea
                required
                rows={3}
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                placeholder="Email, phone number, and mailing address"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-emerald-300">3. Description of Original Work</span>
              <textarea
                required
                rows={4}
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                placeholder="Describe the copyrighted work you own or represent"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-emerald-300">4. URL of Infringing Content</span>
              <input
                type="url"
                required
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                placeholder="https://witnessproject.net/products/..."
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-emerald-300">5. Legal Declaration</span>
              <textarea
                required
                rows={5}
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                defaultValue={`I have a good faith belief that use of the copyrighted material described above is not authorized by the copyright owner, its agent, or the law.

I state under penalty of perjury that the information in this report is accurate and that I am the copyright owner or authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.`}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-emerald-300">6. Signature</span>
              <input
                type="text"
                required
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                placeholder="Type your full legal name as electronic signature"
              />
            </label>

            <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
              This form layout is provided for legal reporting structure. To submit immediately, send completed details to
              WitnessProject.net@gmail.com.
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
