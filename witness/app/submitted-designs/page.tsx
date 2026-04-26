import Link from "next/link";

const submissions: Array<{
  id: string;
  title: string;
  status: string;
  royaltyEarned: number;
  salesDisplay: string;
  agreement: string;
}> = [];

export default function SubmittedDesignsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-emerald-500/10 sm:p-12">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Creator Workspace
          </p>
          <h1 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">Submitted Designs</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            Track every submission from review to payout. See approval status, royalty earnings, and any one-time buyout results.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/submit-design"
              className="inline-flex rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25"
            >
              Submit new design
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
            >
              Back to dashboard
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-emerald-300">Submission pipeline</h2>
          <p className="mt-2 text-sm text-zinc-300">
            Status legend: Pending = in review, Approved = live and earning royalties, Sold to Witness = one-time payout completed.
          </p>
          {submissions.length === 0 ? (
            <div className="mt-5 rounded-xl border border-zinc-700 bg-zinc-950/80 p-5">
              <p className="text-sm font-semibold text-zinc-100">No submissions yet.</p>
              <p className="mt-2 text-sm text-zinc-300">
                Submit your first design to start tracking status, sales, and earnings here.
              </p>
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400">
                    <th className="px-3 py-2 font-semibold">Design</th>
                    <th className="px-3 py-2 font-semibold">Status</th>
                    <th className="px-3 py-2 font-semibold">Agreement</th>
                    <th className="px-3 py-2 font-semibold">Sales</th>
                    <th className="px-3 py-2 font-semibold">Earnings to date</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="border-b border-zinc-800/70">
                      <td className="px-3 py-3 text-zinc-100">
                        <p className="font-semibold">{submission.title}</p>
                        <p className="text-xs text-zinc-400">{submission.id}</p>
                      </td>
                      <td className="px-3 py-3">
                        <span className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-300">
                          {submission.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-zinc-300">{submission.agreement}</td>
                      <td className="px-3 py-3 text-zinc-300">{submission.salesDisplay}</td>
                      <td className="px-3 py-3 text-zinc-100">${submission.royaltyEarned.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
