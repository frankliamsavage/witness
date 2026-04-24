"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

type FilterType = "all" | "friends" | "following";

type User = {
  id: string;
  username: string;
  tagline: string | null;
  bio: string | null;
  legalName: string | null;
  currentCity: string | null;
  currentState: string | null;
  createdAt: Date;
};

export default function ProfilesPage() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [randomUser, setRandomUser] = useState<User | null>(null);
  
  const query = searchParams.get("q") || "";
  
  useEffect(() => {
    setSearchQuery(query);
  }, [query]);
  
  // Fetch users based on current filter
  const fetchUsers = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (filter !== "all") params.set("filter", filter);
      
      const response = await fetch(`/api/profiles?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users || []);
        if (data.randomUser) {
          setRandomUser(data.randomUser);
        }
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, [filter, user]);
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q") as string;
    setSearchQuery(q);
    
    // Update URL
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    const newUrl = `/profiles${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.pushState(null, "", newUrl);
    
    // Fetch with new query
    fetchUsers();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-200 via-amber-100 via-emerald-100 via-sky-200 via-indigo-200 to-fuchsia-200 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-extrabold mb-6 text-center">Public Profiles</h1>

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex justify-center mb-6">
          <input
            type="text"
            name="q"
            placeholder="Search by username, name, or tagline..."
            defaultValue={searchQuery}
            className="w-full sm:w-2/3 rounded-lg border p-3 shadow-sm"
          />
          <button
            type="submit"
            className="ml-2 rounded-lg bg-slate-900 text-white px-4 py-2 hover:bg-slate-700"
          >
            Search
          </button>
        </form>
        
        {/* Filter Buttons */}
        {user && (
          <div className="flex justify-center mb-6 gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white/70 text-slate-700 hover:bg-white"
              }`}
            >
              🌐 All Profiles
            </button>
            <button
              onClick={() => setFilter("friends")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "friends"
                  ? "bg-green-600 text-white"
                  : "bg-white/70 text-slate-700 hover:bg-white"
              }`}
            >
              👥 Friends Only
            </button>
            <button
              onClick={() => setFilter("following")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "following"
                  ? "bg-purple-600 text-white"
                  : "bg-white/70 text-slate-700 hover:bg-white"
              }`}
            >
              ⭐ Following
            </button>
          </div>
        )}

        {/* Random profile */}
        {randomUser && filter === "all" && (
          <div className="flex justify-center mb-8">
            <Link
              href={`/u/${randomUser.username}`}
              className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 font-semibold shadow"
            >
              🎲 View Random Profile
            </Link>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-slate-300 border-t-slate-900 rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">Loading profiles...</p>
          </div>
        )}

        {/* Search results */}
        {!loading && users.length === 0 ? (
          <div className="text-center">
            <p className="text-slate-600 mb-4">
              {searchQuery ? 'No profiles found matching your search.' : 
               filter === "friends" ? 'No friends found. Connect with others to see them here!' :
               filter === "following" ? 'You are not following anyone yet. Follow users to see them here!' :
               'No public profiles available yet.'}
            </p>
            {!searchQuery && filter === "all" && (
              <p className="text-slate-500 text-sm">
                Profiles will appear here as users fill out their information and choose to make their profiles public.
              </p>
            )}
          </div>
        ) : !loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {users.map((u) => (
              <Link
                key={u.id}
                href={`/u/${u.username}`}
                className="rounded-2xl bg-white/70 hover:bg-white transition p-4 ring-1 ring-black/5 shadow-sm"
              >
                <h2 className="text-xl font-semibold">{u.username}</h2>
                {u.tagline && (
                  <p className="text-slate-600 mt-1">{u.tagline}</p>
                )}
                {u.currentCity && (
                  <p className="text-xs text-slate-500 mt-2">
                    {u.currentCity}, {u.currentState}
                  </p>
                )}
                {filter === "friends" && (
                  <div className="flex items-center mt-2">
                    <span className="text-green-600 text-xs font-medium">👥 Friend</span>
                  </div>
                )}
                {filter === "following" && (
                  <div className="flex items-center mt-2">
                    <span className="text-purple-600 text-xs font-medium">⭐ Following</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
