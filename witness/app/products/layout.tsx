import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Shop official Witness products and creator-driven designs.",
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
