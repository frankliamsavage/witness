'use client';
import Link from "next/link";

export default function ThePromisePage() {
  return (
    <main className="min-h-screen bg-gradient-to-tr from-pink-200 via-amber-100 via-emerald-100 via-sky-200 via-indigo-200 to-fuchsia-200 flex flex-col items-center justify-center text-center p-10">
      <h1 className="text-5xl font-extrabold text-slate-900 mb-4">The Promise</h1>
      <p className="text-lg text-slate-700 max-w-2xl leading-relaxed mb-10">
        The Witness Project is built on a covenant between Creator and Creation —
        a reminder that every act of truth and mercy strengthens the bond between
        heaven and earth. This page will expand on that living promise and the
        divine law of witnesshood.
      </p>
      <Link
        href="/"
        className="mt-4 inline-block rounded-lg bg-slate-900 text-white px-6 py-3 text-sm font-medium hover:bg-slate-800 transition"
      >
        ← Back Home
      </Link>
    </main>
  );
}
