'use client';
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-gradient-to-tr from-pink-200 via-amber-100 via-emerald-100 via-sky-200 via-indigo-200 to-fuchsia-200 text-slate-900">

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 min-h-[60vh]">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
          The Witness Project
        </h1>
        <h2 className="mt-3 text-xl sm:text-2xl text-slate-700">
          Connect • Create • Commerce
        </h2>
        
        {/* 18+ Notice */}
        <div className="mt-4 inline-block bg-red-100 border border-red-300 rounded-full px-4 py-2">
          <span className="text-red-800 font-semibold text-sm">🔞 18+ ADULTS ONLY PLATFORM</span>
        </div>
        
        <p className="mt-8 max-w-2xl text-base sm:text-lg text-slate-800 leading-relaxed">
          Join our vibrant community where creativity meets commerce. Connect with fellow gamers,
          share your Minecraft builds, discover digital marketplace opportunities, and build
          lasting friendships in our secure 18+ social environment.
        </p>
        
        {/* 18+ Platform Notice */}
        <div className="mt-6 max-w-xl mx-auto bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm text-green-800">
            <strong>👀 Browse Freely:</strong> View Minecraft and Marketplace content without creating an account<br/>
            <strong>📝 Join Community:</strong> Must be 18+ to create an account and access social features
          </p>
        </div>
      </section>

      {/* Music Hub CTA - Prominent for Stream Viewers */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-3">🎵 Submit Your Music</h2>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
            Get your music reviewed by industry professionals on our live stream. Submit today and get featured!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/music-department"
              className="inline-block rounded-lg bg-white text-blue-600 px-8 py-3 text-lg font-bold hover:bg-blue-50 transition shadow-lg"
            >
              Submit Music Now
            </Link>
            <Link
              href="/music-hub"
              className="inline-block rounded-lg bg-blue-500 text-white px-8 py-3 text-lg font-bold hover:bg-blue-700 transition border-2 border-white"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Engagement */}
      <section className="bg-white/60 backdrop-blur-sm border-t border-slate-200 py-20">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Join the Community',
              desc: 'Connect with like-minded adults, share your interests, and build lasting friendships in our secure social environment.',
              link: '/dashboard',
              btn: 'Get Started',
            },
            {
              title: 'Minecraft Universe',
              desc: 'Showcase your builds, join creative servers, and connect with fellow builders in our dedicated Minecraft community.',
              link: '/minecraft',
              btn: 'Explore',
            },
            {
              title: 'Digital Marketplace',
              desc: 'Discover opportunities, showcase your skills, and engage in digital commerce within our trusted community.',
              link: '/marketplace',
              btn: 'Browse',
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold">{c.title}</h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {c.desc}
              </p>
              <Link
                href={c.link}
                className="mt-4 inline-block rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800"
              >
                {c.btn}
              </Link>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}