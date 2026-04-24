import React, { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AgeVerificationProvider } from "@/components/AgeVerificationProvider";
import "./globals.css";

export const metadata = {
  title: "The Witness Project - Connect, Create, Commerce",
  description: "Join our 18+ community for gaming, creativity, and meaningful connections.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <body className="flex flex-col min-h-screen">
          <AgeVerificationProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </AgeVerificationProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
