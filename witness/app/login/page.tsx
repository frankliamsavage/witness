"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getSupabasePublicConfig } from "@/lib/supabase/env";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const configured = Boolean(getSupabasePublicConfig());
  const urlError = searchParams.get("error");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!configured) {
      setError(
        "Supabase is not configured. Copy .env.example to .env.local and add your project URL and anon key.",
      );
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signErr) {
        setError(signErr.message);
        return;
      }

      router.refresh();
      router.push(nextPath.startsWith("/") ? nextPath : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8">
      <p className="mb-3 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
        Account Access
      </p>
      <h1 className="text-3xl font-bold text-zinc-50">Log In</h1>
      <p className="mt-2 text-sm text-zinc-300">
        Sign in to manage your submissions, profile, and royalty dashboard.
      </p>

      {!configured && (
        <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
          Add your Supabase keys to <code className="text-amber-100">.env.local</code> (see{" "}
          <code className="text-amber-100">.env.example</code>).
        </p>
      )}

      {urlError === "confirm" && (
        <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
          Email confirmation failed or the link expired. Request a new link from Supabase or sign in again.
        </p>
      )}
      {urlError === "auth" && (
        <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
          Invalid confirmation link.
        </p>
      )}

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
            autoComplete="email"
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
            autoComplete="current-password"
          />
        </label>

        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !configured}
          className="mt-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Log In"}
        </button>
      </form>
    </section>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-6 py-16 sm:px-10">
        <Suspense
          fallback={
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8">
              <p className="text-sm text-zinc-400">Loading…</p>
            </section>
          }
        >
          <LoginForm />
        </Suspense>

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
