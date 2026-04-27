import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Builder",
  description: "Build and manage your creator profile on Witness.",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
