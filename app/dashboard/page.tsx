'use client';
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { checkAdminStatus } from "@/app/actions/adminActions";

export default function DashboardHome() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
      return;
    }
    
    if (user) {
      // Check admin status from database
      const checkAdmin = async () => {
        const status = await checkAdminStatus();
        setIsAdmin(status.isAdmin);
      };
      checkAdmin();
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-pink-200 via-amber-100 via-emerald-100 via-sky-200 via-indigo-200 to-fuchsia-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-xl text-slate-900">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-200 via-amber-100 via-emerald-100 via-sky-200 via-indigo-200 to-fuchsia-200 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Dashboard Header - Fixed Dec 1, 2025 */}
        <h1 className="text-4xl font-extrabold">Dashboard</h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/profile"
            className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 hover:bg-white/90 transition"
          >
            <div className="text-xl font-semibold flex items-center gap-2">
              <span>👤</span>
              Edit My Profile
            </div>
            <div className="mt-2 text-sm text-slate-700">
              Banner, identity, bio, photos, and posts
            </div>
          </Link>

          <Link
            href="/dashboard/inbox"
            className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 hover:bg-white/90 transition"
          >
            <div className="text-xl font-semibold flex items-center gap-2">
              <span>📧</span>
              Inbox
            </div>
            <div className="mt-2 text-sm text-slate-700">
              Send and receive private messages
            </div>
          </Link>

          <Link
            href="/dashboard/newsfeed"
            className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 hover:bg-white/90 transition"
          >
            <div className="text-xl font-semibold flex items-center gap-2">
              <span>📰</span>
              News Feed
            </div>
            <div className="mt-2 text-sm text-slate-700">
              Random, friends, local, and national content
            </div>
          </Link>

          <Link
            href="/dashboard/friends"
            className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 hover:bg-white/90 transition"
          >
            <div className="text-xl font-semibold flex items-center gap-2">
              <span>👥</span>
              Friends
            </div>
            <div className="mt-2 text-sm text-slate-700">
              Manage friendships and connections
            </div>
          </Link>

          <Link
            href="/dashboard/settings"
            className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 hover:bg-white/90 transition"
          >
            <div className="text-xl font-semibold flex items-center gap-2">
              <span>⚙️</span>
              Settings
            </div>
            <div className="mt-2 text-sm text-slate-700">
              Privacy, notifications, and preferences
            </div>
          </Link>

          <Link
            href="/dashboard/create"
            className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 hover:bg-white/90 transition"
          >
            <div className="text-xl font-semibold flex items-center gap-2">
              <span>✨</span>
              Create Post
            </div>
            <div className="mt-2 text-sm text-slate-700">
              Share text, images, videos, links, or report community issues
            </div>
          </Link>
        </div>

        {/* Admin Dashboard Button at Bottom */}
        {isAdmin && (
          <div className="mt-8 text-center">
            <Link
              href="/dashboard/admin"
              className="inline-flex items-center gap-3 bg-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="text-2xl">⚡</span>
              <div>
                <div className="text-lg">Admin Dashboard</div>
                <div className="text-sm text-red-200">Full moderation and admin controls</div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
