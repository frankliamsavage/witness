"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";

export function CartNavLink({ compact = false }: { compact?: boolean }) {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      className={`relative inline-flex items-center rounded-lg border border-zinc-700 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300 ${
        compact ? "gap-1.5 px-2.5 py-2" : "gap-2 px-3 py-1.5"
      }`}
    >
      <span aria-hidden>🛒</span>
      {!compact && <span>Cart</span>}
      <span className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-1.5 py-0.5 text-[10px] text-emerald-300">
        {compact ? itemCount : `${itemCount} ${itemCount === 1 ? "item" : "items"}`}
      </span>
    </Link>
  );
}
