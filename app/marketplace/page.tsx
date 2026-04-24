'use client';
import Link from "next/link";

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-pink-50 via-amber-50 to-emerald-50">
      
      {/* Hero Section */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-4">Marketplace</h1>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed mb-10">
            The Witness Marketplace is where craft, trade, and creation meet.
            Rainy Daize Crochet, Witness apparel, and handcrafted goods will be
            available here soon — merging art, purpose, and divine commerce.
          </p>
        </div>
      </section>

      {/* Marketplace Roadmap */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Marketplace Roadmap</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Our marketplace evolves in phases to ensure quality and compliance while building a sustainable creator economy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Phase 1 - Current */}
            <div className="bg-white rounded-xl p-8 shadow-sm border">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-bold">CURRENT</span>
                <h3 className="text-xl font-bold text-gray-900">Phase 1: Platform Curation</h3>
              </div>
              
              <ul className="space-y-3 text-gray-700 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Showcasing exceptional community builds</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Platform-selected featured opportunities</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Recognition and visibility for creators</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Community voting and feedback</span>
                </li>
              </ul>

              <div className="text-sm text-gray-600">
                <strong>Focus:</strong> Building creator identity and community engagement through quality showcasing
              </div>
            </div>

            {/* Phase 2 - Future */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold">PLANNED</span>
                <h3 className="text-xl font-bold text-gray-900">Phase 2: Creator Monetization</h3>
              </div>
              
              <ul className="space-y-3 text-gray-700 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">→</span>
                  <span>Community trading and transactions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">→</span>
                  <span>Creator monetization (18+ requirement)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">→</span>
                  <span>Commissioned builds and services</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">→</span>
                  <span>Revenue sharing for featured content</span>
                </li>
              </ul>

              <div className="text-sm text-blue-700">
                <strong>Requirements:</strong> Age verification, tax compliance, and mature moderation systems
              </div>
            </div>
          </div>

          {/* Timeline & FAQ */}
          <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h4 className="font-bold text-yellow-900 mb-3">Frequently Asked Questions</h4>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="font-medium text-yellow-800 mb-1">When can I start selling builds?</p>
                <p className="text-yellow-700">Phase 2 timeline depends on community size, legal framework completion, and platform stability.</p>
              </div>
              <div>
                <p className="font-medium text-yellow-800 mb-1">Why the 18+ requirement for monetization?</p>
                <p className="text-yellow-700">Legal compliance for tax reporting, contracts, and business relationships requires adult participants.</p>
              </div>
              <div>
                <p className="font-medium text-yellow-800 mb-1">How can I prepare for Phase 2?</p>
                <p className="text-yellow-700">Focus on building your creator profile, showcase quality work, and engage with the community.</p>
              </div>
              <div>
                <p className="font-medium text-yellow-800 mb-1">Will minors be excluded from Phase 2?</p>
                <p className="text-yellow-700">Minors can still showcase work and receive recognition; only direct monetization requires adult status.</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-block rounded-lg bg-slate-900 text-white px-6 py-3 text-sm font-medium hover:bg-slate-800 transition"
            >
              ← Back Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
