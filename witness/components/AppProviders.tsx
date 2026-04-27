"use client";

import { CartProvider } from "@/components/cart/CartContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
