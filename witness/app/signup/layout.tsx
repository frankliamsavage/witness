import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Witness account to shop, submit designs, and track royalties.",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
