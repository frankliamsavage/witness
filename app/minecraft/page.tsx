'use client';
import Link from "next/link";
import { useState } from "react";

export default function MinecraftPage() {
  const [copiedIP, setCopiedIP] = useState(false);
  const [activeSection, setActiveSection] = useState('gameworlds');
  const serverIP = "mc.witnessproject.net:25567";

  const copyServerIP = () => {
    navigator.clipboard.writeText(serverIP);
    setCopiedIP(true);
    setTimeout(() => setCopiedIP(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-16 h-16 bg-green-600 transform rotate-12 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-12 h-12 bg-amber-600 transform -rotate-12 animate-bounce"></div>
        <div className="absolute bottom-32 left-40 w-20 h-20 bg-blue-600 transform rotate-45 animate-spin"></div>
        <div className="absolute bottom-20 right-20 w-14 h-14 bg-red-600 transform -rotate-45 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
              <span className="text-3xl">⛏️</span>
            </div>
            <div className="text-left">
              <h1 className="text-6xl font-extrabold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Witness Minecraft
              </h1>
              <p className="text-xl text-slate-600 font-medium">The Ultimate Competition Server</p>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              🌟 Where Truth Meets Adventure - 13 Unique Game Modes! 🌟
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-4">
              Experience the most feature-rich Minecraft server ever created. From OneBlock progression to TikTok integration, 
              we&apos;ve built a universe of possibilities for every type of player.
            </p>
            <p className="text-sm text-slate-600 font-medium">
              💡 Server connection details available at the bottom of this page
            </p>
          </div>

        </div>

        {/* WITNESS COMPETITIONS */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                  <span className="text-4xl">🏆</span>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white">
                    Witness Competitions
                  </h3>
                </div>
                <p className="text-lg text-white/90 mb-2">
                  Join our skill-based competitions and showcase your creativity. Real prizes, fair play, and a chance to shape our server's future.
                </p>
                <p className="text-sm text-white/80">
                  Free to enter • Multiple contests • Cash prizes for eligible adults
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  href="/minecraft/competition"
                  className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-6 rounded-xl text-lg transition transform hover:scale-105 shadow-lg"
                >
                  🏆 View Competitions
                </Link>
                <Link 
                  href="/minecraft/competitions"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur text-white font-semibold py-4 px-6 rounded-xl text-lg transition"
                >
                  📋 Competition Rules
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8 overflow-x-auto">
          <div className="bg-white/80 rounded-xl p-2 shadow-lg flex gap-2 min-w-max">
            {[
              { id: 'gameworlds', label: '🌎 Game Worlds', icon: '🏝️' },
              { id: 'competitive', label: '⚔️ Competitive', icon: '🏆' },
              { id: 'tech', label: '👾 Tech Systems', icon: '🤖' },
              { id: 'economy', label: '🪙 Economy', icon: '💰' },
              { id: 'community', label: '👥 Community', icon: '🤝' },
              { id: 'roadmap', label: '🚀 Coming Soon', icon: '⭐' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`px-4 py-3 rounded-lg font-bold transition-all ${
                  activeSection === tab.id 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden text-xl">{tab.icon}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="min-h-[600px]">
          {/* Game Worlds Section */}
          {activeSection === 'gameworlds' && (
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-center text-slate-800 mb-8">🌎 PRIMARY GAMEWORLDS</h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                {/* OneBlock Realm */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 shadow-lg border border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">1️⃣</span>
                    <h3 className="text-2xl font-bold text-green-800">OneBlock Realm</h3>
                    <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-bold">BentoBox</span>
                  </div>
                  <ul className="space-y-2 text-green-700">
                    <li>🧱 Single regenerating block progression</li>
                    <li>📈 Full BentoBox OneBlock phases</li>
                    <li>⚡ Custom difficulty ramping</li>
                    <li>🏝️ Island expansion & border system</li>
                    <li>👥 Group islands up to 8 members</li>
                    <li>🌀 Unique Witness Sacrifice Portal mechanic</li>
                    <li>⚖️ Rebalanced progression curve</li>
                    <li>⛏️ Custom ore unlock levels (Iron & Diamond)</li>
                  </ul>
                </div>

                {/* Boxed World */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl p-6 shadow-lg border border-amber-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">2️⃣</span>
                    <h3 className="text-2xl font-bold text-amber-800">Boxed World</h3>
                    <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded-full text-xs font-bold">BentoBox</span>
                  </div>
                  <ul className="space-y-2 text-amber-700">
                    <li>📦 6-sided cube &quot;boxed&quot; worlds</li>
                    <li>🏗️ Creative building under constraints</li>
                    <li>📏 Limited space challenges</li>
                    <li>⬆️ Box upgrades system</li>
                    <li>🔄 Multi-box challenges</li>
                    <li>🏆 Leaderboard scoring</li>
                    <li>💰 Integrated Moo-lah economy</li>
                    <li>🌊 Warp between Boxed and OneBlock</li>
                  </ul>
                </div>

                {/* Farmland SMP */}
                <div className="bg-gradient-to-br from-red-50 to-rose-100 rounded-xl p-6 shadow-lg border border-red-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">3️⃣</span>
                    <h3 className="text-2xl font-bold text-red-800">Farmland SMP</h3>
                    <span className="bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs font-bold">Wild West</span>
                  </div>
                  <ul className="space-y-2 text-red-700">
                    <li>🌍 Open-world survival realm</li>
                    <li>🚫 No land claims - pure FFA</li>
                    <li>⚔️ Raiding allowed</li>
                    <li>🏘️ Player-built wild bases</li>
                    <li>🌾 Crop-centered economy</li>
                    <li>⚡ Optional PvP zones</li>
                    <li>🏪 Farm-to-market gameplay</li>
                    <li>💀 Hardcore death penalties (optional)</li>
                  </ul>
                </div>

                {/* Creative Mode */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl p-6 shadow-lg border border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">4️⃣</span>
                    <h3 className="text-2xl font-bold text-purple-800">Creative Realm</h3>
                    <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs font-bold">Unlimited</span>
                  </div>
                  <ul className="space-y-2 text-purple-700">
                    <li>🏡 Claim plots system</li>
                    <li>∞ Build without limits</li>
                    <li>🎨 Share builds with community</li>
                    <li>📋 Export schematics</li>
                    <li>🏆 Enter build competitions</li>
                    <li>🔧 Redstone & command access</li>
                    <li>🎪 Showcase island builds</li>
                    <li>🎉 Witness community events</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Competitive Section */}
          {activeSection === 'competitive' && (
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-center text-slate-800 mb-8">⚔️ COMPETITIVE & SPECIAL MODES</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* FFA Arena */}
                <div className="bg-gradient-to-br from-red-50 to-orange-100 rounded-xl p-8 shadow-lg border border-red-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">5️⃣</span>
                    <h3 className="text-2xl font-bold text-red-800">FFA / Arena PvP</h3>
                  </div>
                  <ul className="space-y-3 text-red-700">
                    <li className="flex items-center gap-2">
                      <span className="text-red-600">⚡</span>
                      <span>Easy teleport from hub</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-red-600">⚔️</span>
                      <span>Kit-based and gear-based arenas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-red-600">🏃</span>
                      <span>No claim, no hiding—pure PvP</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-red-600">📊</span>
                      <span>Ranking system in development</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-red-600">🏆</span>
                      <span>Scheduled PvP tournaments</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-red-600">🎯</span>
                      <span>Seasonal ELO leaderboard</span>
                    </li>
                  </ul>
                </div>

                {/* Justice System */}
                <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-8 shadow-lg border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">6️⃣</span>
                    <h3 className="text-2xl font-bold text-slate-800">Justice System / Jail</h3>
                  </div>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-center gap-2">
                      <span className="text-slate-600">🔒</span>
                      <span>Hackers without tags → Auto jail</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-600">🏢</span>
                      <span>Jail cell isolation system</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-600">⚖️</span>
                      <span>Witness &quot;truth test&quot; system</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-600">💬</span>
                      <span>Chat limitations for offenders</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-600">🏷️</span>
                      <span>Alternative hacker realm (tagged)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-600">⭐</span>
                      <span>Jail tasks for early release</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tech Systems Section */}
          {activeSection === 'tech' && (
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-center text-slate-800 mb-8">👾 STREAMER & TECH SYSTEMS</h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                {/* TikFinity Integration */}
                <div className="bg-gradient-to-br from-pink-50 to-purple-100 rounded-xl p-8 shadow-lg border border-pink-200 lg:col-span-2">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">7️⃣</span>
                    <div>
                      <h3 className="text-3xl font-bold text-pink-800">TikFinity Streamer Integration</h3>
                      <span className="bg-pink-200 text-pink-800 px-3 py-1 rounded-full text-sm font-bold">EXCLUSIVE FEATURE</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/50 rounded-lg p-6 mb-6">
                    <p className="text-lg font-bold text-pink-800 mb-3">🌟 MAJOR FEATURE - Few servers have this!</p>
                    <p className="text-pink-700 mb-4">Live TikTok effects that trigger real-time in-game events:</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-xl font-bold text-pink-800">Live Interaction Examples:</h4>
                      <ul className="space-y-2 text-pink-700">
                        <li className="flex items-center gap-2">
                          <span className="text-pink-600">🌹</span>
                          <span>&quot;Send a rose&quot; = Mobs spawn</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-pink-600">🦁</span>
                          <span>&quot;Send a lion&quot; = Boss spawn</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-pink-600">🎁</span>
                          <span>Gifts = Explosions & lightning</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-pink-600">💬</span>
                          <span>Chat reactions trigger events</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-xl font-bold text-pink-800">Streamer Benefits:</h4>
                      <ul className="space-y-2 text-pink-700">
                        <li className="flex items-center gap-2">
                          <span className="text-pink-600">📺</span>
                          <span>TikTok viewers influence gameplay</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-pink-600">🏆</span>
                          <span>Perfect for livestream competitions</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-pink-600">🔥</span>
                          <span>Unique to Witness branding</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-pink-600">⭐</span>
                          <span>Front-page worthy feature</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Java Edition Support */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 shadow-lg border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">☕</span>
                    <h3 className="text-2xl font-bold text-blue-800">Java Edition Support</h3>
                  </div>
                  <ul className="space-y-3 text-blue-700">
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600">☕</span>
                      <span>Java Edition 1.12.10 Only</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600">⚡</span>
                      <span>Optimized server performance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600">🔧</span>
                      <span>Custom server patches</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600">🔒</span>
                      <span>Secure authentication</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600">✅</span>
                      <span>Stable 1.12.10 compatibility</span>
                    </li>
                  </ul>
                </div>

                {/* BentoBox Add-ons */}
                <div className="bg-gradient-to-br from-green-50 to-teal-100 rounded-xl p-8 shadow-lg border border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">📦</span>
                    <h3 className="text-2xl font-bold text-green-800">BentoBox Ecosystem</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {['OneBlock', 'Boxed', 'Level', 'Challenges', 'Bank', 'Missions', 'Ranks', 'Border', 'Warps', 'Upgrades', 'Tiers', 'Limits'].map((addon) => (
                      <div key={addon} className="flex items-center gap-2 text-green-700">
                        <span className="text-green-600">✔</span>
                        <span className="font-medium">{addon}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Economy Section */}
          {activeSection === 'economy' && (
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-center text-slate-800 mb-8">🪙 ECONOMY & SYSTEMS</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Moo-Lah Economy */}
                <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-xl p-6 shadow-lg border border-yellow-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">8️⃣</span>
                    <h3 className="text-xl font-bold text-yellow-800">Moo-Lah Economy</h3>
                  </div>
                  <ul className="space-y-2 text-yellow-700">
                    <li>💰 Custom currency system</li>
                    <li>🏆 Earn through challenges & farming</li>
                    <li>🛒 Spend on upgrades & unlocks</li>
                    <li>🎨 Buy skins & portals</li>
                    <li>📈 Dynamic market pricing</li>
                  </ul>
                </div>

                {/* Sacrificial Portal */}
                <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-6 shadow-lg border border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">9️⃣</span>
                    <h3 className="text-xl font-bold text-purple-800">Sacrifice Portal</h3>
                  </div>
                  <ul className="space-y-2 text-purple-700">
                    <li>🌀 Island-exclusive portal</li>
                    <li>🗑️ Permanently deletes items</li>
                    <li>💎 Converts to island bank value</li>
                    <li>📈 &quot;Sacrifice for growth&quot; loop</li>
                    <li>⚖️ Risk vs reward mechanics</li>
                  </ul>
                </div>

                {/* Island Bank */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl p-6 shadow-lg border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🔟</span>
                    <h3 className="text-xl font-bold text-blue-800">Island Bank</h3>
                  </div>
                  <ul className="space-y-2 text-blue-700">
                    <li>🏦 Store island wealth</li>
                    <li>📏 Spend on size upgrades</li>
                    <li>⚡ Generator improvements</li>
                    <li>🌱 Crop growth boosts (future)</li>
                    <li>👥 Shared wallet for members</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Community Section */}
          {activeSection === 'community' && (
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-center text-slate-800 mb-8">👥 COMMUNITY FEATURES</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Website Integration */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-xl p-8 shadow-lg border border-indigo-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">12️⃣</span>
                    <h3 className="text-2xl font-bold text-indigo-800">WitnessProject.net Profiles</h3>
                  </div>
                  <ul className="space-y-3 text-indigo-700">
                    <li className="flex items-center gap-2">
                      <span className="text-indigo-600">👤</span>
                      <span>Custom player avatars</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-indigo-600">🔗</span>
                      <span>Island linking & showcasing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-indigo-600">📊</span>
                      <span>Real-time stats & analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-indigo-600">🏆</span>
                      <span>Game achievements display</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-indigo-600">📱</span>
                      <span>Online dashboards</span>
                    </li>
                  </ul>
                </div>

                {/* Events & Challenges */}
                <div className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-xl p-8 shadow-lg border border-rose-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">13️⃣</span>
                    <h3 className="text-2xl font-bold text-rose-800">Events & Challenges</h3>
                  </div>
                  <ul className="space-y-3 text-rose-700">
                    <li className="flex items-center gap-2">
                      <span className="text-rose-600">📅</span>
                      <span>Daily & weekly rotating goals</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-rose-600">🔄</span>
                      <span>Seasonal server resets</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-rose-600">🎃</span>
                      <span>Special holiday events</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-rose-600">👹</span>
                      <span>Server-wide boss fights</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-rose-600">🎁</span>
                      <span>Community rewards & prizes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Roadmap Section */}
          {activeSection === 'roadmap' && (
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-center text-slate-800 mb-8">🚀 WITNESS ROADMAP - COMING SOON</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Dungeons World', icon: '🏰', desc: 'Instanced dungeon challenges' },
                  { name: 'Boss Arenas', icon: '👹', desc: 'Epic boss fight encounters' },
                  { name: 'Mission Storylines', icon: '📜', desc: 'Quest-based progression' },
                  { name: 'Witness Lore Codex', icon: '📚', desc: 'Deep server lore system' },
                  { name: 'Sanctuary Realm', icon: '⛪', desc: 'Holy peaceful sanctuary' },
                  { name: 'WBF Credits', icon: '💎', desc: 'Blockchain Foundation economy' },
                  { name: 'Voting Rewards', icon: '🗳️', desc: 'Server-wide voting benefits' },
                  { name: 'Auction House', icon: '🏪', desc: 'Player-to-player trading' },
                  { name: 'Custom Pets', icon: '🐕', desc: 'Unique companion animals' },
                  { name: 'Custom Armor Sets', icon: '⚔️', desc: 'Exclusive gear designs' },
                  { name: 'Island Prestige', icon: '⭐', desc: 'Prestige ranking system' },
                  { name: 'Advanced Features', icon: '🔮', desc: 'And much more...' }
                ].map((feature, index) => (
                  <div key={index} className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                    <div className="text-center">
                      <div className="text-4xl mb-3">{feature.icon}</div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.name}</h3>
                      <p className="text-slate-600 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SERVER CONNECTION - Now at the bottom */}
        <div className="text-center mt-16 mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">🚀 Ready to Join?</h3>
            <p className="text-lg text-slate-700 mb-6">
              Connect to our server and experience everything you just read about!
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap mb-4">
              <div className="bg-gradient-to-r from-slate-100 to-slate-200 px-6 py-3 rounded-lg font-mono text-xl font-bold text-slate-800 shadow-inner">
                mc.witnessproject.net:25567
              </div>
              <button
                onClick={copyServerIP}
                className={`px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 ${
                  copiedIP 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg'
                }`}
              >
                {copiedIP ? '✓ Copied!' : '📋 Copy Server IP'}
              </button>
            </div>
            <div className="flex justify-center gap-8 text-sm">
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <span className="font-bold text-green-800">Version:</span> <span className="text-green-700">1.12.10</span>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="font-bold text-blue-800">Players:</span> <span className="text-blue-700">Java Only</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl text-white mb-8">
            <h3 className="text-3xl font-bold mb-4">Welcome to the Future of Minecraft!</h3>
            <p className="text-xl mb-6">Experience 13 unique game modes, active competitions, and a thriving community.</p>
            <div className="flex justify-center">
              <Link
                href="/dashboard"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold transition-colors shadow-lg transform hover:scale-105"
              >
                🏠 Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
