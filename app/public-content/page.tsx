'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

export default function PublicContentPage() {
  const searchParams = useSearchParams();
  const reason = searchParams?.get('reason');
  const age = searchParams?.get('age');
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Age Restriction Notice */}
        {reason === 'age_restricted' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-yellow-800">Profile Creation Restricted</h3>
                <div className="mt-2 text-yellow-700">
                  <p className="mb-2">
                    You must be 18 or older to create a profile on this platform. 
                    {age && ` You are currently ${age} years old.`}
                  </p>
                  <p className="text-sm">
                    You can still view public content and will be able to create a profile when you turn 18.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Public Content</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore public content, testimonies, and community discussions available to all visitors.
          </p>
        </div>

        {/* Public Content Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Book of Life */}
          <Link href="/book-of-life" className="group">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600">Book of Life</h3>
              <p className="text-slate-600 text-sm">
                Read community testimonies and stories from users around the world.
              </p>
            </div>
          </Link>

          {/* Sanctuary */}
          <Link href="/sanctuary" className="group">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
              <div className="text-4xl mb-4">⛪</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600">Sanctuary</h3>
              <p className="text-slate-600 text-sm">
                Explore spiritual content and community discussions in a safe space.
              </p>
            </div>
          </Link>

          {/* Minecraft */}
          <Link href="/minecraft" className="group">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600">Minecraft Server</h3>
              <p className="text-slate-600 text-sm">
                Join our community Minecraft server and explore virtual worlds together.
              </p>
            </div>
          </Link>

          {/* The Promise */}
          <Link href="/the-promise" className="group">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600">The Promise</h3>
              <p className="text-slate-600 text-sm">
                Learn about our community mission and values.
              </p>
            </div>
          </Link>

          {/* Help */}
          <Link href="/help" className="group">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
              <div className="text-4xl mb-4">❓</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600">Help & Support</h3>
              <p className="text-slate-600 text-sm">
                Get help and find answers to frequently asked questions.
              </p>
            </div>
          </Link>

          {/* Marketplace */}
          <Link href="/marketplace" className="group">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
              <div className="text-4xl mb-4">🛒</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600">Marketplace</h3>
              <p className="text-slate-600 text-sm">
                Browse community marketplace and offerings.
              </p>
            </div>
          </Link>

        </div>

        {/* Age Progression Info */}
        {user && age && parseInt(age) < 18 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-3">🎂 Coming Soon</h3>
            <p className="text-blue-800 mb-4">
              When you turn 18, you'll automatically gain access to:
            </p>
            <ul className="text-blue-700 space-y-2">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Full profile creation and customization
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Private messaging with other users
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Content creation and sharing
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Full community interaction features
              </li>
            </ul>
            
            {age && (
              <p className="text-blue-600 text-sm mt-4">
                You have {18 - parseInt(age)} year{18 - parseInt(age) !== 1 ? 's' : ''} until full access.
              </p>
            )}
          </div>
        )}

        {/* Footer Links */}
        <div className="text-center mt-12 space-x-6">
          <Link href="/legal" className="text-slate-500 hover:text-slate-700 underline">Legal</Link>
          <Link href="/privacy" className="text-slate-500 hover:text-slate-700 underline">Privacy</Link>
          <Link href="/terms" className="text-slate-500 hover:text-slate-700 underline">Terms</Link>
          <Link href="/support" className="text-slate-500 hover:text-slate-700 underline">Support</Link>
        </div>

      </div>
    </div>
  );
}