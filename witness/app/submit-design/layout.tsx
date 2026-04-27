import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit Design",
  description: "Submit artwork or ideas to Witness for review and launch consideration.",
};

export default function SubmitDesignLayout({ children }: { children: React.ReactNode }) {
  return children;
}
