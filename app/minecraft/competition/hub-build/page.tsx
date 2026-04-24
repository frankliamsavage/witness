'use client';

import Link from "next/link";
import { useState } from "react";

export default function HubBuildCompetitionPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📖' },
    { id: 'rules', label: 'Rules', icon: '📋' },
    { id: 'how-to-enter', label: 'How to Enter', icon: '🎯' },
    { id: 'teams', label: 'Teams', icon: '👥' },
    { id: 'faq', label: 'FAQ', icon: '❓' }
  ];

  // No current applicants - competition is open for applications
  const appliedTeams: any[] = [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Building': return 'bg-blue-100 text-blue-800';
      case 'Submitted': return 'bg-purple-100 text-purple-800';
      case 'Finalist': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="text-6xl mb-4">🏗️</div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Season One Hub<br />
            <span className="text-yellow-300">Build Competition</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-8 text-blue-100 max-w-3xl mx-auto">
            Design the heart of our Minecraft server. Your creation will become the official Season One hub where thousands of players begin their journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/discord"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-8 rounded-xl text-lg transition transform hover:scale-105"
            >
              🎮 Apply on Discord
            </Link>
            <Link 
              href="/minecraft/competition/hub-build/teams"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition transform hover:scale-105"
            >
              👥 View Teams
            </Link>
            <Link 
              href="/minecraft/competitions"
              className="bg-white/20 hover:bg-white/30 backdrop-blur text-white font-semibold py-4 px-8 rounded-xl text-lg transition"
            >
              📋 View Competition Rules
            </Link>
          </div>
          <p className="text-sm text-blue-200 mt-4">
            Get whitelisted + assigned a private build world
          </p>
        </div>
      </section>

      {/* TAB NAVIGATION */}
      <section className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white border-b-2 border-blue-500'
                    : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TAB CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* Competition Overview */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Competition Overview</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center max-w-4xl mx-auto">
                We need a central hub that welcomes players, provides easy navigation, and captures the essence of the Witness Project. 
                Think spawn points, portals, information boards, and spaces for community gathering. Your design will be the first thing 
                every player sees when they join our world.
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="text-3xl mb-3">🎨</div>
                  <h3 className="font-bold text-lg mb-2">Creative Excellence</h3>
                  <p className="text-gray-600">Unique designs that inspire and welcome players into our world.</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="text-3xl mb-3">⚡</div>
                  <h3 className="font-bold text-lg mb-2">Functional Design</h3>
                  <p className="text-gray-600">Practical layouts that help players navigate and understand the server.</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="text-3xl mb-3">🌟</div>
                  <h3 className="font-bold text-lg mb-2">Community Focus</h3>
                  <p className="text-gray-600">Spaces that encourage interaction and embody our community values.</p>
                </div>
              </div>
            </section>

            {/* Timeline & Prizes */}
            <section className="bg-white/70 backdrop-blur py-12 px-8 rounded-2xl">
              <div className="grid lg:grid-cols-2 gap-12">
                
                {/* Timeline */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">⏰ Competition Timeline</h2>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-green-500 rounded-full w-4 h-4 mt-1 mr-4 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-green-700">Registration Open</h3>
                        <p className="text-gray-600">Join our Discord and request competition server access</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-blue-500 rounded-full w-4 h-4 mt-1 mr-4 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-blue-700">Build Phase</h3>
                        <p className="text-gray-600">Create your hub design on our dedicated competition server</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purple-500 rounded-full w-4 h-4 mt-1 mr-4 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-purple-700">Submission Deadline</h3>
                        <p className="text-gray-600">Finalize your entry and submit for judging</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-yellow-500 rounded-full w-4 h-4 mt-1 mr-4 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-yellow-700">Judging Day: June 3rd, 2026</h3>
                        <p className="text-gray-600">Final evaluation and winner announcement</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prizes */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">🎁 Winner Rewards</h2>
                  <div className="space-y-6">
                    <div className="bg-white/70 rounded-lg p-4">
                      <h3 className="font-bold text-amber-700 mb-2">🔞 Adult Winners (18+)</h3>
                      <p className="text-gray-700 text-sm mb-2">Choose your reward:</p>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• $200 USD cash prize</li>
                        <li>• OR exclusive in-game cosmetic package</li>
                      </ul>
                    </div>
                    <div className="bg-white/70 rounded-lg p-4">
                      <h3 className="font-bold text-blue-700 mb-2">🎮 All Winners</h3>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• Exclusive cosmetic rewards</li>
                        <li>• Special recognition titles</li>
                        <li>• Permanent credit in hub design</li>
                        <li>• Community showcase features</li>
                        <li>• Your build becomes the official server hub!</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* RULES TAB */}
        {activeTab === 'rules' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">📋 Competition Rules & Requirements</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold text-emerald-600 mb-4">Hub Must Include:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2"><span className="text-green-500 mt-1">✓</span> Clearly marked spawn point</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 mt-1">✓</span> Navigation to different game modes</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 mt-1">✓</span> Information boards or displays</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 mt-1">✓</span> Community gathering spaces</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 mt-1">✓</span> Server rules display area</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 mt-1">✓</span> Portal or warp areas</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold text-red-600 mb-4">Important Notes:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2"><span className="text-yellow-500 mt-1">!</span> Must be original work</li>
                  <li className="flex items-start gap-2"><span className="text-yellow-500 mt-1">!</span> Family-friendly content only</li>
                  <li className="flex items-start gap-2"><span className="text-yellow-500 mt-1">!</span> No copyrighted material</li>
                  <li className="flex items-start gap-2"><span className="text-yellow-500 mt-1">!</span> Server performance considerations</li>
                  <li className="flex items-start gap-2"><span className="text-yellow-500 mt-1">!</span> Follows server building standards</li>
                  <li className="flex items-start gap-2"><span className="text-yellow-500 mt-1">!</span> One submission per participant</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4 text-center">🎯 Judging Criteria</h3>
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl mb-2">✨</div>
                  <strong className="block">Creativity</strong>
                  <span className="text-sm text-gray-600">Original and inspiring design concepts</span>
                </div>
                <div>
                  <div className="text-2xl mb-2">🔧</div>
                  <strong className="block">Functionality</strong>
                  <span className="text-sm text-gray-600">Practical player navigation and usability</span>
                </div>
                <div>
                  <div className="text-2xl mb-2">🤝</div>
                  <strong className="block">Community Feel</strong>
                  <span className="text-sm text-gray-600">Welcoming atmosphere and social spaces</span>
                </div>
                <div>
                  <div className="text-2xl mb-2">🏗️</div>
                  <strong className="block">Technical Skill</strong>
                  <span className="text-sm text-gray-600">Building craftsmanship and attention to detail</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-900 rounded-lg p-6 text-center text-white">
              <p className="text-blue-200">
                <strong>Need Help?</strong> Join our Discord and ask questions in the #competitions channel. 
                Our community and staff are happy to help clarify requirements or provide building tips!
              </p>
            </div>
          </div>
        )}

        {/* HOW TO ENTER TAB */}
        {activeTab === 'how-to-enter' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How to Enter & Submit</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Join Our Discord</h3>
                <p className="text-gray-600 mb-4">Connect with our community and request competition server access in the #competitions channel.</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Build Your Hub</h3>
                <p className="text-gray-600">Create your design on our dedicated competition server with provided materials and tools.</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Submit Entry</h3>
                <p className="text-gray-600">Complete the submission form with your entry details and any additional information.</p>
              </div>
            </div>

            {/* Discord CTA after step 1 */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <Link
                href="/discord"
                className="inline-block bg-white text-indigo-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-xl text-lg transition transform hover:scale-105 shadow-lg mb-3"
              >
                🎮 Apply on Discord
              </Link>
              <p className="text-indigo-100 text-sm">
                Get whitelisted + assigned a private build world
              </p>
            </div>

            <div className="text-center">
              <Link 
                href="/minecraft/competition" 
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-4 px-8 rounded-xl text-lg transition"
              >
                ← Back to All Competitions
              </Link>
            </div>
          </div>
        )}

        {/* TEAMS TAB */}
        {activeTab === 'teams' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Competition Teams</h2>
            
            {/* Status Legend */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-center text-gray-900 mb-6">📋 Status Legend</h3>
              <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
                <div className="bg-white rounded-lg p-4">
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 mb-2">Applied</span>
                  <p className="text-xs text-gray-600">Submitted application, awaiting review</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-2">Approved</span>
                  <p className="text-xs text-gray-600">Accepted, ready for build world</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-2">Building</span>
                  <p className="text-xs text-gray-600">Actively working on their hub</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 mb-2">Submitted</span>
                  <p className="text-xs text-gray-600">Completed and ready for judging</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 mb-2">Finalist</span>
                  <p className="text-xs text-gray-600">Advanced to final judging</p>
                </div>
              </div>
            </div>
            
            {/* No Teams Yet Message */}
            <div className="bg-white rounded-lg p-12 shadow-sm border text-center">
              <div className="text-6xl mb-4">🏗️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Be the First to Apply!</h3>
              <p className="text-gray-600 text-lg mb-6">
                The competition is open and we're looking for talented builders to create our Season One hub. 
                Solo builders and teams both welcome!
              </p>
              <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
                💡 <strong>Pro tip:</strong> Competition will be more exciting with multiple entries. 
                Spread the word and encourage other builders to join!
              </div>
            </div>

            {/* Want to Compete CTA */}
            <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl p-8 text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Want to Compete?</h3>
                <p className="text-emerald-100 mb-6 text-lg">
                  Ready to join the competition? Apply on Discord and get your team started!
                </p>
                <Link
                  href="/discord"
                  className="inline-block bg-white text-emerald-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-xl text-lg transition transform hover:scale-105 shadow-lg mb-4"
                >
                  🎮 Apply on Discord
                </Link>
                <div className="bg-white/20 backdrop-blur rounded-lg p-4 max-w-2xl mx-auto">
                  <p className="text-emerald-100 text-sm">
                    <strong>Instructions:</strong> Post in #competitions using the template:<br/>
                    "Team Name | Captain IGN | Member List | Hub Design Concept"
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ TAB */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {[
                {
                  q: "Can I participate as a solo builder or do I need a team?",
                  a: "Both solo builders and teams are welcome! You can compete individually or form a team of up to 4 members."
                },
                {
                  q: "What materials and tools will be provided?",
                  a: "Competition worlds come with unlimited creative mode materials, WorldEdit access, and custom building tools. Everything you need to create an amazing hub!"
                },
                {
                  q: "How long do we have to build our hub?",
                  a: "The build phase runs from registration approval until the submission deadline. You'll have approximately 3-4 months to create your design."
                },
                {
                  q: "Can we visit other teams' builds during the competition?",
                  a: "Each team gets a private build world during the competition. Builds will be revealed publicly during the judging phase."
                },
                {
                  q: "What happens if we win?",
                  a: "The winning hub becomes the official Season One spawn! Winners receive their choice of $200 USD (18+) or exclusive cosmetics, plus permanent recognition and special titles."
                },
                {
                  q: "Are there any restrictions on build themes or styles?",
                  a: "Builds must be family-friendly, original work that captures the Witness Project spirit. No copyrighted content, and designs should be optimized for server performance."
                },
                {
                  q: "How will the judging process work?",
                  a: "Builds are judged on creativity, functionality, community feel, and technical skill. Our panel includes Witness staff and community representatives."
                },
                {
                  q: "Can we get feedback during the building process?",
                  a: "Yes! Join our Discord #competitions channel for tips, feedback, and to connect with other builders."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border">
                  <h3 className="font-bold text-lg text-gray-900 mb-3">❓ {faq.q}</h3>
                  <p className="text-gray-700">{faq.a}</p>
                </div>
              ))}
            </div>

            <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Still Have Questions?</h3>
              <p className="text-gray-700 mb-6">Join our Discord community and ask in the #competitions channel!</p>
              <Link
                href="/discord"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition"
              >
                💬 Join Discord
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
