import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { CartNavLink } from "@/components/cart/CartNavLink";
import { getSupabasePublicConfig } from "@/lib/supabase/env";

export async function SiteHeader() {
  let user: { email?: string; user_metadata?: { screen_name?: string; role?: string } } | null =
    null;

  if (getSupabasePublicConfig()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-8 lg:px-16">
        <Link href="/" className="text-sm font-bold tracking-wide text-emerald-300">
          WITNESS
        </Link>

        <nav className="hidden flex-wrap items-center justify-end gap-2 sm:gap-3 md:flex">
          <Link
            href="/"
            className="mobile-touch-target rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="mobile-touch-target rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
          >
            Products
          </Link>
          <Link
            href="/how-it-works"
            className="mobile-touch-target rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
          >
            How It Works
          </Link>
          <Link
            href="/about"
            className="mobile-touch-target rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="mobile-touch-target rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
          >
            Contact
          </Link>
          <Link
            href="/dashboard"
            className="mobile-touch-target rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
          >
            Dashboard
          </Link>
          <CartNavLink />
          {user ? (
            <>
              <span className="hidden max-w-[10rem] truncate text-xs text-zinc-400 sm:inline">
                {user.user_metadata?.screen_name ?? user.email}
              </span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="mobile-touch-target rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="mobile-touch-target rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="mobile-touch-target rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25"
              >
                Create Account
              </Link>
            </>
          )}
        </nav>

        <details className="relative md:hidden">
          <summary className="mobile-touch-target cursor-pointer list-none rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300">
            Menu
          </summary>
          <div className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-zinc-700 bg-zinc-950/95 p-3 shadow-2xl shadow-emerald-500/10">
            <div className="grid gap-2">
              <Link href="/" className="mobile-touch-target rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200">Home</Link>
              <Link href="/products" className="mobile-touch-target rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200">Products</Link>
              <Link href="/how-it-works" className="mobile-touch-target rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200">How It Works</Link>
              <Link href="/about" className="mobile-touch-target rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200">About</Link>
              <Link href="/contact" className="mobile-touch-target rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200">Contact</Link>
              <Link href="/dashboard" className="mobile-touch-target rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200">Dashboard</Link>
              <div className="pt-1">
                <CartNavLink />
              </div>
              {user ? (
                <form action={signOut}>
                  <button
                    type="submit"
                    className="mobile-touch-target w-full rounded-lg border border-zinc-700 px-3 py-2 text-left text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                  >
                    Log out
                  </button>
                </form>
              ) : (
                <div className="grid gap-2">
                  <Link href="/login" className="mobile-touch-target rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200">Log In</Link>
                  <Link href="/signup" className="mobile-touch-target rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-300">Create Account</Link>
                </div>
              )}
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
