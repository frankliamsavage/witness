"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string;
  designId: number;
  name: string;
  imagePath: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
};

type AddToCartInput = Omit<CartItem, "id" | "quantity"> & { quantity?: number };

type CartContextValue = {
  items: CartItem[];
  addToCart: (item: AddToCartInput) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
};

const STORAGE_KEY = "witness-cart-v1";

const CartContext = createContext<CartContextValue | null>(null);

function getItemId(designId: number, size: string, color: string) {
  return `${designId}:${size}:${color}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as CartItem[];
      if (Array.isArray(parsed)) {
        setItems(parsed.filter((item) => item.quantity > 0));
      }
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addToCart: (input) => {
        const quantity = input.quantity ?? 1;
        if (quantity <= 0) return;
        const id = getItemId(input.designId, input.size, input.color);
        setItems((prev) => {
          const existing = prev.find((item) => item.id === id);
          if (existing) {
            return prev.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity + quantity } : item,
            );
          }
          return [...prev, { ...input, id, quantity }];
        });
      },
      removeFromCart: (itemId) => {
        setItems((prev) => prev.filter((item) => item.id !== itemId));
      },
      updateQuantity: (itemId, quantity) => {
        setItems((prev) =>
          prev
            .map((item) => (item.id === itemId ? { ...item, quantity: Math.max(0, quantity) } : item))
            .filter((item) => item.quantity > 0),
        );
      },
      clearCart: () => setItems([]),
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return value;
}
