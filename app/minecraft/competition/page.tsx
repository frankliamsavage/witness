'use client';

import Link from "next/link";

export default function MinecraftCompetitionIndexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Witness Minecraft<br />
            <span className="text-yellow-300">Competitions</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-8 text-blue-100 max-w-3xl mx-auto">
            Join our skill-based competitions and showcase your creativity. Multiple contests, amazing prizes, and a chance to shape our server's future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/minecraft/competitions"
              className="bg-white/20 hover:bg-white/30 backdrop-blur text-white font-semibold py-4 px-8 rounded-xl text-lg transition"
            >
              📋 Read Competition Rules
            </Link>
          </div>
        </div>
      </section>

      {/* GENERAL OVERVIEW */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How Our Competitions Work</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            All Witness Minecraft competitions are <strong>skill-based</strong>, <strong>free to enter</strong>, and designed to celebrate creativity and community contribution. 
            Each competition has its own theme and timeline, but all follow our fair play guidelines.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-3xl mb-3">🎮</div>
              <h3 className="font-bold text-lg mb-2">Gameplay Participation</h3>
              <p className="text-gray-600">Gameplay participation is open. Social and commercial platform features are restricted to users 18+.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-bold text-lg mb-2">Cash Prize Eligibility</h3>
              <p className="text-gray-600">Cash compensation restricted to eligible adults. Teams with minors receive recognition and cosmetic rewards only.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-3xl mb-3">⚖️</div>
              <h3 className="font-bold text-lg mb-2">Fair Competition</h3>
              <p className="text-gray-600">No pay-to-win mechanics. Your skill and creativity determine success.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVE COMPETITIONS */}
      <section className="bg-white/70 backdrop-blur py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">🔥 Active Competitions</h2>
          
          {/* Hub Build Competition */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl p-8 mb-8 border border-orange-200">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">🏗️</span>
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                      Season One Hub Build Competition
                    </h3>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">🔴 LIVE NOW</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Judging: June 3rd, 2026</span>
                    </div>
                  </div>
                </div>
                <p className="text-lg text-gray-700 mb-4">
                  Design the central hub that will welcome thousands of players to our Season One server. 
                  Your creation could become the official spawn area where every player begins their journey.
                </p>
                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                  <span className="bg-gray-100 px-2 py-1 rounded">🎯 Server Hub Design</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">💰 $200 USD for eligible adults</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">🎨 Exclusive cosmetics</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">🆓 Free to enter</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Link 
                  href="/minecraft/competition/hub-build"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl text-lg transition transform hover:scale-105 text-center"
                >
                  🎮 Enter This Competition
                </Link>
                <p className="text-center text-sm text-gray-600">
                  View details, rules & how to submit
                </p>
              </div>
            </div>
          </div>

          {/* Future Competitions Placeholder */}
          <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-2xl p-8 border border-gray-200">
            <div className="text-center">
              <div className="text-4xl mb-4">⏳</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">More Competitions Coming Soon</h3>
              <p className="text-gray-600 mb-6">
                We're planning exciting new competitions including build battles, redstone challenges, and community events. 
                Stay tuned for announcements!
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-sm">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">⚡ Redstone Engineering</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">🏰 Architecture Showcase</span>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">🎨 Pixel Art Contest</span>
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">⚔️ PvP Tournaments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPETITION GUIDELINES */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">⚖️ General Guidelines</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-xl font-bold text-emerald-600 mb-4">✅ What's Allowed</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2"><span className="text-green-500 mt-1">•</span> Original creative work</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-1">•</span> Collaboration (when permitted)</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-1">•</span> Using server resources</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-1">•</span> Getting community feedback</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-xl font-bold text-red-600 mb-4">❌ What's Prohibited</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2"><span className="text-red-500 mt-1">•</span> Copied or stolen designs</li>
                <li className="flex items-start gap-2"><span className="text-red-500 mt-1">•</span> Exploiting bugs or glitches</li>
                <li className="flex items-start gap-2"><span className="text-red-500 mt-1">•</span> Inappropriate content</li>
                <li className="flex items-start gap-2"><span className="text-red-500 mt-1">•</span> Harassment of other participants</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Compete?</h2>
          <p className="text-xl text-blue-200 mb-8">
            Choose a competition above to get started, or read our complete rules to understand how everything works.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/minecraft/competitions"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition transform hover:scale-105"
            >
              📋 Read Full Competition Rules
            </Link>
            <Link 
              href="/discord" 
              className="bg-white/20 hover:bg-white/30 backdrop-blur text-white font-semibold py-4 px-8 rounded-xl text-lg transition"
            >
              💬 Join Our Discord
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}