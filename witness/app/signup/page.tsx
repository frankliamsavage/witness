"use client";

import { useState } from "react";
import Link from "next/link";

type Role = "Customer" | "Creator";

export default function SignupPage() {
  const [screenName, setScreenName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("Creator");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-16 sm:px-10">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8">
          <p className="mb-3 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            New Account
          </p>
          <h1 className="text-3xl font-bold text-zinc-50">Create Account</h1>
          <p className="mt-2 text-sm text-zinc-300">
            Set up your profile to submit designs, monitor royalties, and manage your creator data.
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            Both account types can buy products. Creator accounts include submission and royalty tools.
          </p>

          <form onSubmit={onSubmit} className="mt-6 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-emerald-300">Screen name</span>
              <input
                value={screenName}
                onChange={(e) => setScreenName(e.target.value)}
                required
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                placeholder="How you appear on WITNESS"
                autoComplete="nickname"
              />
              <span className="text-xs text-zinc-500">
                This is your public name on the site. Your legal name is collected later when you set up payouts.
              </span>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
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
                <span className="text-sm font-semibold text-emerald-300">Account type</span>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                >
                  <option value="Customer">Customer</option>
                  <option value="Creator">Creator</option>
                </select>
              </label>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3 text-xs text-zinc-300">
              <p>
                <span className="font-semibold text-emerald-300">Customer:</span> Shop products and manage orders.
              </p>
              <p className="mt-1">
                <span className="font-semibold text-emerald-300">Creator:</span> Shop products + submit designs + track royalties.
              </p>
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-emerald-300">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                placeholder="Create a secure password"
              />
            </label>

            <button
              type="submit"
              className="mt-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25"
            >
              Create Account
            </button>
          </form>

          {submitted && (
            <p className="mt-4 text-sm text-zinc-300">
              Mock account created. Next step is saving this data to a real auth + database backend.
            </p>
          )}
        </section>

        <p className="text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-emerald-300 hover:underline">
            Log in
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
