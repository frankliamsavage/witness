'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const amount = searchParams?.get('amount');

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 text-stone-800">
      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        
        {/* Gratitude Header */}
        <div className="mb-12">
          <div className="text-6xl mb-6">🙏</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Your Gift Has Been Received
          </h1>
          <div className="text-xl text-green-700 font-medium">
            With Hearts Full of Gratitude
          </div>
        </div>

        {/* Amount Display */}
        {amount && (
          <div className="mb-8 p-6 bg-white border border-green-200 rounded-xl shadow-sm">
            <div className="text-sm text-stone-600 mb-2">Gift Amount</div>
            <div className="text-3xl font-bold text-green-700">${amount}</div>
            <div className="text-sm text-stone-500 mt-2">
              Given freely with love, received with thanksgiving
            </div>
          </div>
        )}

        {/* Blessing and Thanks */}
        <div className="bg-white p-8 rounded-xl shadow-sm border mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            May YHWH Bless Your Generous Heart
          </h2>
          
          <div className="text-left space-y-4 text-stone-700">
            <p>
              Beloved friend, your gift has been received with profound gratitude and humility. 
              We are moved by your generous spirit and your heart to support this labor of love.
            </p>
            
            <p>
              Your gift comes to us as a pure blessing—given freely with no expectations, 
              received with thanksgiving and prayer. We pledge to steward this gift with 
              integrity and use it in service of the mission YHWH has placed before us.
            </p>
            
            <blockquote className="border-l-4 border-green-300 pl-4 italic text-stone-600">
              &ldquo;The generous will themselves be blessed, for they share their food with the poor.&rdquo; 
              — Proverbs 22:9
            </blockquote>
            
            <p>
              May the One who sees your heart in secret reward you openly. 
              May His peace be upon you and His favor continue to follow you all your days.
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link 
            href="/book-of-life"
            className="p-6 bg-blue-50 border border-blue-200 rounded-xl hover:shadow-md transition text-center group"
          >
            <div className="text-2xl mb-3 group-hover:scale-110 transition-transform">📖</div>
            <h3 className="font-semibold text-blue-800 mb-2">Explore the Book of Life</h3>
            <p className="text-sm text-blue-600">
              Read testimonies and stories from our community
            </p>
          </Link>
          
          <Link 
            href="/sanctuary"
            className="p-6 bg-purple-50 border border-purple-200 rounded-xl hover:shadow-md transition text-center group"
          >
            <div className="text-2xl mb-3 group-hover:scale-110 transition-transform">⛪</div>
            <h3 className="font-semibold text-purple-800 mb-2">Visit the Sanctuary</h3>
            <p className="text-sm text-purple-600">
              Find peace and spiritual content in our sacred space
            </p>
          </Link>
        </div>

        {/* Return Home */}
        <div className="mt-12">
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 bg-stone-800 text-white rounded-xl hover:bg-stone-700 transition"
          >
            Return to Witness Project
          </Link>
        </div>
        
        {/* Footer Note */}
        <p className="mt-8 text-sm text-stone-500">
          A confirmation email will be sent to you shortly. 
          Your gift helps sustain this labor of love. Blessings and peace.
        </p>

      </section>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}