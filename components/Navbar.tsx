"use client";

import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const [showSanctuary, setShowSanctuary] = useState(false);

  // Check if user should see spiritual content
  useEffect(() => {
    if (isSignedIn && user) {
      // Only show sanctuary for specific users or admin accounts
      // You can adjust this logic as needed
      const specialAccess = user.emailAddresses?.[0]?.emailAddress?.includes('admin') || 
                           user.publicMetadata?.sanctuaryAccess === true;
      setShowSanctuary(specialAccess);
    }
  }, [isSignedIn, user]);

  return (
    <nav className="w-full px-6 py-4 bg-white shadow-md flex items-center justify-between">
      {/* Logo / Brand */}
      <Link href="/" className="text-xl font-bold text-slate-900 hover:text-slate-700 transition-colors">
        Witness
      </Link>

      {/* CENTER LINKS (Public navigation) */}
      <div className="flex gap-6 text-slate-800 font-medium">
        <Link href="/music-hub" className="hover:underline">
          🎵 Music
        </Link>
        <Link href="/minecraft" className="hover:underline">
          Minecraft
        </Link>
        <Link href="/marketplace" className="hover:underline">
          Marketplace
        </Link>
        <Link href="/profiles" className="hover:underline">
          Community
        </Link>
        {/* Only show Sanctuary for authorized users */}
        {showSanctuary && (
          <Link href="/sanctuary" className="hover:underline text-purple-600">
            Sanctuary
          </Link>
        )}
      </div>

      {/* RIGHT SIDE AUTH / DASHBOARD */}
      <div className="flex gap-4 items-center">
        {isSignedIn ? (
          <>
            <Link
              href="/dashboard"
              className="hover:underline text-slate-800 font-medium"
            >
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </>
        ) : (
          <>
            <Link
              href="/sign-in"
              className="hover:underline text-slate-800 font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="hover:underline text-slate-800 font-medium"
            >
              Join (18+)
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
