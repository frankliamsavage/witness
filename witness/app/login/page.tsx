"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-6 py-16 sm:px-10">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8">
          <p className="mb-3 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Account Access
          </p>
          <h1 className="text-3xl font-bold text-zinc-50">Log In</h1>
          <p className="mt-2 text-sm text-zinc-300">
            Sign in to manage your submissions, profile, and royalty dashboard.
          </p>

          <form onSubmit={onSubmit} className="mt-6 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-emerald-300">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                placeholder="you@example.com"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-emerald-300">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                placeholder="Enter your password"
              />
            </label>

            <button
              type="submit"
              className="mt-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25"
            >
              Log In
            </button>
          </form>

          {submitted && (
            <p className="mt-4 text-sm text-zinc-300">
              Mock login submitted. Next step is wiring real auth and user session handling.
            </p>
          )}
        </section>

        <p className="text-sm text-zinc-400">
          Need an account?{" "}
          <Link href="/signup" className="font-semibold text-emerald-300 hover:underline">
            Create one here
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
