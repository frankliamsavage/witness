import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Witness",
  description: "Witness - Transparent products, pricing, and creator participation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3 sm:px-10 lg:px-16">
            <Link href="/" className="text-sm font-bold tracking-wide text-emerald-300">
              WITNESS
            </Link>

            <nav className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/products"
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
              >
                Products
              </Link>
              <Link
                href="/dashboard"
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
              >
                Dashboard
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25"
              >
                Create Account
              </Link>
            </nav>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
