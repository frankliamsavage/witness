'use client';

import Link from "next/link";

export default function MinecraftCompetitionsRulesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      
      {/* HEADER */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">🏆</div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Witness Minecraft
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-blue-100 mb-6">
            Competition Rules & Guidelines
          </h2>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Welcome to Witness Minecraft competitions. These events are designed to celebrate creativity, skill, and 
            community contribution while maintaining a fair, non-pay-to-win environment for all players.
          </p>
        </div>
      </section>

      {/* RULES CONTENT */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
          
          {/* 1. GENERAL OVERVIEW */}
          <div className="bg-white rounded-lg p-8 mb-8 shadow-sm border">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">1</span>
              General Overview
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Witness Minecraft competitions are skill-based challenges hosted within the Witness Server. Each competition 
              will have its own theme, timeline, and prize structure, but all competitions follow the rules outlined on this page.
            </p>
            <p className="text-gray-700 font-semibold">
              Participation is free unless explicitly stated otherwise.
            </p>
          </div>

          {/* 2. ELIGIBILITY */}
          <div className="bg-white rounded-lg p-8 mb-8 shadow-sm border">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">2</span>
              Eligibility
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>Gameplay participation</strong> is open to all players, regardless of age.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>Some prizes</strong> (including cash prizes) are available only to eligible participants aged 18 or older.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Eligibility for prizes</strong> is determined at the time of judging.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>No purchase</strong> is required to enter or win any competition.</span>
              </li>
            </ul>
          </div>

          {/* 3. COMPETITION-SPECIFIC RULES */}
          <div className="bg-white rounded-lg p-8 mb-8 shadow-sm border">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="bg-purple-100 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">3</span>
              Competition-Specific Rules
            </h3>
            <p className="text-gray-700 mb-4">Each competition will include its own page detailing:</p>
            <div className="grid md:grid-cols-2 gap-4 text-gray-700">
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><span className="text-blue-500">•</span> Competition name</li>
                <li className="flex items-center gap-2"><span className="text-blue-500">•</span> Theme or challenge</li>
                <li className="flex items-center gap-2"><span className="text-blue-500">•</span> Submission method</li>
                <li className="flex items-center gap-2"><span className="text-blue-500">•</span> Start and end dates</li>
              </ul>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><span className="text-purple-500">•</span> Judging date</li>
                <li className="flex items-center gap-2"><span className="text-purple-500">•</span> Prize details</li>
              </ul>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> If a conflict exists between these general rules and a competition-specific page, 
                the competition-specific rules take precedence.
              </p>
            </div>
          </div>

          {/* 4. SUBMISSIONS & ORIGINALITY */}
          <div className="bg-white rounded-lg p-8 mb-8 shadow-sm border">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="bg-orange-100 text-orange-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">4</span>
              Submissions & Originality
            </h3>
            <p className="text-gray-700 mb-4">By entering a competition, participants confirm that:</p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>Submissions are their original work</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>They have the right to submit the content</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>The submission does not infringe on the rights of others</span>
              </li>
            </ul>
            <p className="text-gray-700 mt-4 font-medium">
              Collaborative submissions are allowed only if all contributors are clearly identified.
            </p>
          </div>

          {/* 5. JUDGING & EVALUATION */}
          <div className="bg-white rounded-lg p-8 mb-8 shadow-sm border">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">5</span>
              Judging & Evaluation
            </h3>
            <p className="text-gray-700 mb-4">
              Submissions are evaluated by Witness Server staff and/or designated judges using criteria such as:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2"><span className="text-indigo-500">⚡</span> Creativity and originality</li>
                <li className="flex items-center gap-2"><span className="text-indigo-500">🔧</span> Technical execution</li>
                <li className="flex items-center gap-2"><span className="text-indigo-500">🎯</span> Functionality and usability</li>
              </ul>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2"><span className="text-purple-500">🎨</span> Adherence to theme</li>
                <li className="flex items-center gap-2"><span className="text-purple-500">⭐</span> Overall quality</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-red-800 font-semibold">
                Judging decisions are final.
              </p>
            </div>
          </div>

          {/* 6. PRIZES & REWARDS */}
          <div className="bg-white rounded-lg p-8 mb-8 shadow-sm border">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="bg-yellow-100 text-yellow-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">6</span>
              Prizes & Rewards
            </h3>
            <p className="text-gray-700 mb-6 font-medium">Prize eligibility depends on participant age:</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Adults */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                  🔞 Participants aged 18 or older
                </h4>
                <p className="text-sm text-green-700 mb-3">May be eligible for:</p>
                <ul className="space-y-2 text-green-700">
                  <li className="flex items-center gap-2"><span className="text-green-500">💰</span> Cash prizes (subject to verification)</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">🎨</span> Exclusive in-game cosmetics</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">🏆</span> Recognition and credit</li>
                </ul>
              </div>

              {/* Minors */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                  🎮 Participants under 18
                </h4>
                <p className="text-sm text-blue-700 mb-3">May receive:</p>
                <ul className="space-y-2 text-blue-700">
                  <li className="flex items-center gap-2"><span className="text-blue-500">🎨</span> Exclusive non-cash rewards</li>
                  <li className="flex items-center gap-2"><span className="text-blue-500">👑</span> Unique cosmetic items</li>
                  <li className="flex items-center gap-2"><span className="text-blue-500">🏅</span> Titles or recognition</li>
                  <li className="flex items-center gap-2"><span className="text-blue-500">⭐</span> In-game prestige rewards</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-red-800 font-semibold text-center">
                Cash prizes are not available to participants under 18.
              </p>
            </div>
            
            <p className="text-gray-600 text-sm mt-4 text-center">
              Prize options will be clearly stated on each competition's page.
            </p>
          </div>

          {/* 7-12. ADDITIONAL SECTIONS */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Use of Submissions */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-pink-100 text-pink-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">7</span>
                Use of Submissions & Licensing
              </h4>
              <p className="text-sm text-gray-700 mb-3">By submitting an entry, participants grant Witness Project a non-exclusive, royalty-free license to:</p>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Use, display, modify, and implement submitted content</li>
                <li>• Feature submissions within the Witness Server</li>
                <li>• Promote competitions and community content</li>
              </ul>
              <p className="text-xs text-gray-800 font-semibold mt-3">Participants retain ownership of their work.</p>
            </div>

            {/* No Employment */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-teal-100 text-teal-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">8</span>
                No Employment Relationship
              </h4>
              <p className="text-sm text-gray-700 mb-3">Participation in any Witness Minecraft competition:</p>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Does not create an employment relationship</li>
                <li>• Does not guarantee future paid opportunities</li>
                <li>• Is considered a voluntary contest, not contract work</li>
              </ul>
            </div>

            {/* Fair Play */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">9</span>
                Fair Play & Conduct
              </h4>
              <p className="text-sm text-gray-700 mb-3">Participants must:</p>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Follow server rules</li>
                <li>• Avoid exploits or unfair advantages</li>
                <li>• Respect other competitors</li>
                <li>• Avoid impersonation or misrepresentation</li>
              </ul>
            </div>

            {/* Disqualification */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-red-100 text-red-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">10</span>
                Disqualification & Removal
              </h4>
              <p className="text-sm text-gray-700 mb-3">Witness Project may disqualify a participant if:</p>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Rules are violated</li>
                <li>• Content is plagiarized or stolen</li>
                <li>• Eligibility is misrepresented</li>
                <li>• Behavior disrupts the competition</li>
              </ul>
            </div>

            {/* Changes */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-amber-100 text-amber-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">11</span>
                Changes & Updates
              </h4>
              <p className="text-sm text-gray-700 mb-3">Witness Project reserves the right to:</p>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Modify competition rules</li>
                <li>• Adjust timelines if necessary</li>
                <li>• Cancel competitions due to unforeseen circumstances</li>
              </ul>
              <p className="text-xs text-gray-600 mt-2">Changes will be communicated through official channels.</p>
            </div>

            {/* Acceptance */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-violet-100 text-violet-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">12</span>
                Acceptance of Rules
              </h4>
              <p className="text-sm text-gray-700">
                By entering a Witness Minecraft competition, participants acknowledge that they have read, 
                understood, and agreed to these rules.
              </p>
            </div>
          </div>

          {/* NAVIGATION */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
            <h3 className="text-xl font-bold mb-4">Ready to Compete?</h3>
            <p className="mb-6 text-blue-100">
              View current competitions and start building your entry today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/minecraft/competition"
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg transition"
              >
                🏗️ Current Competition
              </Link>              <Link 
                href="/minecraft/competitions/faq"
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                ❓ FAQ
              </Link>
              <Link 
                href="/minecraft/competitions/archive"
                className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                📚 Archive
              </Link>              <Link 
                href="/minecraft"
                className="bg-white/20 hover:bg-white/30 backdrop-blur text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                🎮 Back to Minecraft
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}