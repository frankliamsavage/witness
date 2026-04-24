"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { checkAdminStatus } from "@/app/actions/adminActions";

const dashboardLinks = [
  { href: "/dashboard", label: "🏠 Overview", exact: true },
  { href: "/dashboard/newsfeed", label: "📰 Newsfeed" },
  { href: "/dashboard/my-posts", label: "📝 My Posts" },
  { href: "/dashboard/create", label: "✏️ Create Post" },
  { href: "/dashboard/friends", label: "👥 Friends" },
  { href: "/report-issue", label: "🚧 Report Issue" },
  { href: "/dashboard/profile", label: "👤 Profile" },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check admin status from database
  useEffect(() => {
    if (user) {
      const checkAdmin = async () => {
        const status = await checkAdminStatus();
        setIsAdmin(status.isAdmin);
      };
      checkAdmin();
    }
  }, [user]);

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex space-x-8 overflow-x-auto py-4">
          {dashboardLinks.map((link) => {
            const isActive = link.exact 
              ? pathname === link.href 
              : pathname.startsWith(link.href);
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          
          {/* Admin-only navigation */}
          {isAdmin && (
            <Link
              href="/dashboard/admin"
              className={`whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname === "/dashboard/admin"
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : "text-red-600 hover:text-red-900 hover:bg-red-100 font-semibold"
              }`}
            >
              ⚡ Admin Panel
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}