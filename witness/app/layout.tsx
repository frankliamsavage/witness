import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { AppProviders } from "@/components/AppProviders";
import { SiteHeader } from "@/components/SiteHeader";
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
  title: {
    default: "Witness",
    template: "%s | Witness",
  },
  description: "Witness - Transparent products, pricing, and creator participation.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-950 text-zinc-100">
        <AppProviders>
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <footer className="border-t border-zinc-800/80 bg-zinc-950/90">
            <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4 text-xs text-zinc-400 sm:px-10 lg:px-16">
              <p>© {new Date().getFullYear()} Witness Project. Transparent capitalism in motion.</p>
              <div className="flex items-center gap-3">
                <Link href="/terms" className="transition-colors hover:text-emerald-300">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="transition-colors hover:text-emerald-300">
                  Privacy Policy
                </Link>
                <Link href="/contact" className="transition-colors hover:text-emerald-300">
                  Contact
                </Link>
              </div>
            </div>
          </footer>
        </AppProviders>
      </body>
    </html>
  );
}
