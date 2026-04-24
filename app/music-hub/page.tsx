'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

export default function MusicHub() {
  const { user, isLoaded } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-20"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            🎵 The Witness Music Hub
          </h1>
          <p className="text-xl sm:text-2xl text-slate-200 mb-8 max-w-3xl mx-auto">
            Get your music heard by industry professionals. Submit to our live review sessions, build your fanbase, and earn from your art.
          </p>
          
          {isLoaded && user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/music-department"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition shadow-lg"
              >
                Submit Your Music
              </Link>
              <Link
                href="/music"
                className="px-8 py-4 bg-slate-700 text-white rounded-lg font-bold text-lg hover:bg-slate-600 transition border border-slate-600"
              >
                Browse Music
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-up"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition shadow-lg"
              >
                Join Now
              </Link>
              <Link
                href="/music"
                className="px-8 py-4 bg-slate-700 text-white rounded-lg font-bold text-lg hover:bg-slate-600 transition border border-slate-600"
              >
                Browse Music
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1: Submit */}
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 hover:border-blue-500 transition">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">📤</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">1. Submit Your Music</h3>
              <p className="text-slate-300 mb-4">
                Upload your tracks with cover art and details. Our system supports all major audio formats for the best quality.
              </p>
              <ul className="text-slate-400 text-sm space-y-2">
                <li>✓ Multiple format support</li>
                <li>✓ High-quality uploads</li>
                <li>✓ Cover art included</li>
              </ul>
            </div>

            {/* Feature 2: Review */}
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 hover:border-purple-500 transition">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🎙️</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">2. Live Review Session</h3>
              <p className="text-slate-300 mb-4">
                Get professional feedback during our live review streams. Industry experts evaluate your music and provide constructive feedback.
              </p>
              <ul className="text-slate-400 text-sm space-y-2">
                <li>✓ Professional critique</li>
                <li>✓ Live audience exposure</li>
                <li>✓ Networking opportunities</li>
              </ul>
            </div>

            {/* Feature 3: Earn */}
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 hover:border-pink-500 transition">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-pink-700 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">3. Sell & Earn</h3>
              <p className="text-slate-300 mb-4">
                Keep all your approved tracks on your profile to sell downloads, build your fanbase, and earn recurring income from your art.
              </p>
              <ul className="text-slate-400 text-sm space-y-2">
                <li>✓ Keep 100% ownership</li>
                <li>✓ Direct downloads</li>
                <li>✓ Build your fanbase</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Artist Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800 bg-opacity-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">Why Artists Love Us</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: '🎯', title: 'Targeted Exposure', desc: 'Reach dedicated music lovers' },
              { emoji: '🏆', title: 'Professional Feedback', desc: 'From industry reviewers' },
              { emoji: '📈', title: 'Build Your Audience', desc: 'Grow your fanbase organically' },
              { emoji: '💎', title: 'Own Your Music', desc: '100% ownership, 100% earnings' },
            ].map((benefit, idx) => (
              <div key={idx} className="bg-slate-700 rounded-lg p-6 border border-slate-600 hover:border-slate-500 transition">
                <div className="text-4xl mb-3">{benefit.emoji}</div>
                <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-slate-400 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { number: '500+', label: 'Artists' },
              { number: '2,500+', label: 'Songs Reviewed' },
              { number: '100K+', label: 'Streams' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-8 border border-slate-600">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                  {stat.number}
                </div>
                <p className="text-slate-300 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Share Your Music?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join hundreds of artists who've been discovered and helped their music reach new audiences.
            </p>
            {isLoaded && user ? (
              <Link
                href="/music-department"
                className="inline-block px-10 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition shadow-lg"
              >
                Submit Your Music Today
              </Link>
            ) : (
              <Link
                href="/sign-up"
                className="inline-block px-10 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition shadow-lg"
              >
                Create Your Account
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800 bg-opacity-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {[
              {
                q: 'What formats do you accept?',
                a: 'We accept MP3, WAV, FLAC, and AAC formats. Maximum file size is 50MB per track.'
              },
              {
                q: 'How long does review take?',
                a: 'Reviews typically happen within 1-2 weeks. Featured tracks may appear in our live review sessions.'
              },
              {
                q: 'Can I keep my music on the platform?',
                a: 'Absolutely! Once approved, your music stays on your profile for fans to discover and purchase downloads.'
              },
              {
                q: 'How do I earn money?',
                a: 'Artists can set a price for downloads. You keep 100% of sales. We handle the payments securely via Stripe.'
              },
              {
                q: 'Can I delete my music?',
                a: 'Yes, you can remove any track from your profile at any time through your dashboard.'
              },
              {
                q: 'Is there a limit to how many songs I can upload?',
                a: 'No limit! Upload as much music as you want to build your catalog.'
              },
            ].map((item, idx) => (
              <details key={idx} className="group bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition cursor-pointer">
                <summary className="p-6 font-semibold text-white flex items-center justify-between">
                  {item.q}
                  <span className="group-open:rotate-180 transition">▼</span>
                </summary>
                <p className="px-6 pb-6 text-slate-300 border-t border-slate-700 pt-4">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
