import Link from 'next/link';

export default function CompetitionArchivePage() {
  // Future: This will be populated with actual past competitions
  const pastCompetitions = [
    // Will be populated as competitions complete
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      
      {/* Header */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Competition Archive
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            A record of past Minecraft competitions, winners, and their legendary builds.
          </p>
        </div>
      </section>

      {/* Coming Soon State */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Season One Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center mb-8">
            <div className="text-4xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold mb-3">Season One in Progress</h2>
            <p className="text-blue-100 mb-4">
              The Hub Build Competition is currently underway! Winners and builds will appear here after judging concludes.
            </p>
            <Link 
              href="/minecraft/competition/hub-build"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block"
            >
              View Active Competition
            </Link>
          </div>

          {/* Future Competitions Preview */}
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              History in the Making
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              As competitions conclude, this archive will showcase winning builds, 
              team profiles, and the evolution of the Witness Server through community creativity.
            </p>
            
            {/* What Will Be Here */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl mb-2">🏅</div>
                <h4 className="font-semibold text-gray-900">Competition Winners</h4>
                <p className="text-sm text-gray-600">Teams and individuals who shaped our world</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🏗️</div>
                <h4 className="font-semibold text-gray-900">Featured Builds</h4>
                <p className="text-sm text-gray-600">Screenshots and tours of winning creations</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <h4 className="font-semibold text-gray-900">Competition Stats</h4>
                <p className="text-sm text-gray-600">Participation data and community growth</p>
              </div>
            </div>
          </div>

          {/* Community Impact */}
          <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-8">
            <h3 className="text-xl font-bold text-green-900 mb-4 text-center">
              Why We Archive
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-green-800 mb-2">🌱 Community Growth</h4>
                <p className="text-green-700">
                  Documenting our journey from the first competition to a thriving creative ecosystem.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">🎯 Creator Recognition</h4>
                <p className="text-green-700">
                  Permanent recognition for builders who helped shape the Witness experience.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">📈 Transparency</h4>
                <p className="text-green-700">
                  Open record of competition fairness, judging criteria, and prize distribution.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">🔗 Inspiration</h4>
                <p className="text-green-700">
                  Showcasing the best builds to inspire future competitors and new members.
                </p>
              </div>
            </div>
          </div>

          {/* Stay Updated */}
          <div className="mt-8 text-center">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <p className="text-gray-700 mb-4">
                Want to be notified when the first competitions complete?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/discord"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Join Discord
                </Link>
                <Link 
                  href="/minecraft/competitions"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium"
                >
                  View Rules
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}