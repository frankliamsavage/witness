'use client';
import Link from "next/link";

export default function EngagePage() {
  return (
    <main className="min-h-screen bg-gradient-to-tr from-sky-200 via-indigo-200 via-pink-200 to-amber-100 p-10">
      <div className="max-w-4xl mx-auto text-center">
        <div className="pt-16 pb-12">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-4">Engage With the Mission</h1>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed">
            Connect, converse, and share ideas for how The Witness Project can evolve
            into something meaningful for everyone. Join the growing network of those
            ready to build truth and compassion in action.
          </p>
        </div>

        {/* Discord Community Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Join Our Community</h2>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto">
            Connect with fellow members, share ideas, and participate in real-time discussions 
            about building truth and compassion in action.
          </p>
          
          <div className="max-w-md mx-auto">
            <a
              href="https://discord.gg/dYmChRME"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl p-8 block text-center shadow-lg hover:shadow-xl transition-all group"
            >
              <div className="text-white text-6xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-3">Discord Community</h3>
              <p className="text-indigo-100 mb-6 text-sm">
                Real-time community chat, discussions, and collaboration
              </p>
              <div className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium group-hover:bg-indigo-50 transition-colors">
                Join Our Discord →
              </div>
            </a>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              More social media platforms coming soon as our community grows
            </p>
          </div>
        </div>

        {/* Community Polls Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Community Issue Reporting</h2>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto">
            Report public issues in your community. Citizens identify problems, community proposes solutions, 
            businesses submit bids, everyone votes, and we fund the winning solution together.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
            {/* Report Issue Card */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
              <div className="text-red-600 text-4xl mb-4">🚧</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Report an Issue</h3>
              <p className="text-slate-600 text-sm mb-6">
                Found a pothole, broken streetlight, or other public problem? Report it with photos and location.
              </p>
              <Link
                href="/report-issue"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium block text-center transition-colors"
              >
                Report Issue →
              </Link>
            </div>

            {/* View Issues Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="text-blue-600 text-4xl mb-4">👀</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Browse Issues</h3>
              <p className="text-slate-600 text-sm mb-6">
                See what issues your neighbors have reported and help propose solutions or vote on fixes.
              </p>
              <Link
                href="/dashboard/newsfeed?type=POLLS"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium block text-center transition-colors"
              >
                View Issues →
              </Link>
            </div>
          </div>

          {/* Process Flow */}
          <div className="grid md:grid-cols-5 gap-4 text-center text-sm">
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="text-red-500 text-2xl mb-2">1️⃣</div>
              <div className="font-medium text-slate-900 mb-1">Report Issue</div>
              <div className="text-slate-600">Post problem with photos & location</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="text-yellow-500 text-2xl mb-2">2️⃣</div>
              <div className="font-medium text-slate-900 mb-1">Propose Solutions</div>
              <div className="text-slate-600">Community & businesses suggest fixes</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-green-500 text-2xl mb-2">3️⃣</div>
              <div className="font-medium text-slate-900 mb-1">Vote on Best Solution</div>
              <div className="text-slate-600">Community chooses winning approach</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="text-purple-500 text-2xl mb-2">4️⃣</div>
              <div className="font-medium text-slate-900 mb-1">Fund Solution</div>
              <div className="text-slate-600">Donate to make it happen</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-blue-500 text-2xl mb-2">5️⃣</div>
              <div className="font-medium text-slate-900 mb-1">Implement Fix</div>
              <div className="text-slate-600">Winning business does the work</div>
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="inline-block rounded-lg bg-slate-900 text-white px-6 py-3 text-sm font-medium hover:bg-slate-800 transition"
        >
          ← Back Home
        </Link>
      </div>
    </main>
  );
}
