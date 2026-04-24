import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 py-6 text-center text-sm text-stone-500">
      
      {/* Back to Top */}
      <a
        href="#top"
        className="inline-block rounded-full border border-stone-300 px-3 py-1 hover:bg-stone-100 transition"
      >
        ↑ Back to Top
      </a>

      {/* Legal Links - 4 links */}
      <div className="mt-4 flex flex-wrap justify-center gap-6">
        <Link href="/legal" className="text-slate-600 hover:text-slate-900 underline">
          Legal
        </Link>
        <Link href="/privacy" className="text-slate-600 hover:text-slate-900 underline">
          Privacy
        </Link>
        <Link href="/terms" className="text-slate-600 hover:text-slate-900 underline">
          Terms
        </Link>
        <Link href="/support" className="text-slate-600 hover:text-slate-900 underline">
          Support
        </Link>
      </div>

      {/* Copyright */}
      <p className="mt-3">© 2025 WitnessProject.net</p>
    </footer>
  );
}
