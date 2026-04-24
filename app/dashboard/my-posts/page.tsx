"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

interface Post {
  id: string;
  title?: string;
  content: string;
  postType: "TEXT" | "IMAGE" | "VIDEO" | "LINK" | "POLL";
  createdAt: string;
  mediaUrls?: string[];
  videoUrl?: string;
  linkUrl?: string;
  linkTitle?: string;
  linkDescription?: string;
  pollQuestion?: string; // Will be mapped from title
  pollOptions?: { id: string; text: string; votes: number }[];
  pollType?: string;
  upvotes?: number;
  downvotes?: number;
  postVotes?: { id: string; userId: string; voteType: string }[];
  pollVotes?: { id: string; userId: string; optionId: string }[];
}

export default function MyPostsPage() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Fetch user's posts
  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        console.log('📋 My Posts: Fetching posts for user:', user?.username);
        const response = await fetch("/api/newsfeed?feedType=my-posts");
        if (response.ok) {
          const data = await response.json();
          console.log('📋 My Posts: Received', data.posts?.length || 0, 'posts');
          console.log('📋 My Posts: Latest posts:', data.posts?.slice(0, 3).map((p: any) => ({
            id: p.id.substring(0, 8),
            type: p.postType,
            created: p.createdAt,
            content: p.content?.substring(0, 50) + '...'
          })));
          setPosts(data.posts || []);
        } else {
          console.error('📋 My Posts: Failed to fetch posts:', response.status, response.statusText);
        }
      } catch (error) {
        console.error("📋 My Posts: Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyPosts();
    }
  }, [user]);

  // Refresh posts function
  const refreshPosts = async () => {
    setLoading(true);
    try {
      console.log('🔄 My Posts: Refreshing posts...');
      const response = await fetch("/api/newsfeed?feedType=my-posts&_t=" + Date.now());
      if (response.ok) {
        const data = await response.json();
        console.log('🔄 My Posts: Refreshed with', data.posts?.length || 0, 'posts');
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error("🔄 My Posts: Error refreshing posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete post
  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    try {
      setDeleting(postId);
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId));
      } else {
        alert("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error deleting post");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Posts</h1>
          <p className="text-gray-600 mt-2">All your posts, photos, and content in one place</p>
          <div className="mt-4 flex gap-4">
            <Link
              href="/dashboard/create"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              ✏️ Create New Post
            </Link>
            <Link
              href="/dashboard/newsfeed"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              📰 View Newsfeed
            </Link>
            <button
              onClick={refreshPosts}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              {loading ? '🔄' : '↻'} Refresh
            </button>
          </div>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-6">Start sharing your thoughts, photos, and experiences with the community!</p>
            <Link
              href="/dashboard/create"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition inline-block"
            >
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user?.username?.[0]?.toUpperCase() || user?.firstName?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {user?.username || user?.firstName || "You"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()} at{" "}
                        {new Date(post.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      post.postType === "POLL" ? "bg-green-100 text-green-800" :
                      post.postType === "IMAGE" ? "bg-blue-100 text-blue-800" :
                      post.postType === "VIDEO" ? "bg-purple-100 text-purple-800" :
                      post.postType === "LINK" ? "bg-orange-100 text-orange-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {post.postType}
                    </span>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      disabled={deleting === post.id}
                      className="text-red-600 hover:text-red-800 p-1 rounded disabled:opacity-50"
                      title="Delete post"
                    >
                      {deleting === post.id ? "..." : "🗑️"}
                    </button>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  {post.postType === "POLL" && post.pollQuestion && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{post.pollQuestion}</h3>
                      {post.pollOptions && (
                        <div className="space-y-2">
                          {post.pollOptions.map((option) => (
                            <div key={option.id} className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-700">{option.text}</span>
                                <span className="text-sm text-gray-500">{option.votes} votes</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {post.content && (
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {post.content}
                    </p>
                  )}

                  {/* Media */}
                  {((post.mediaUrls && post.mediaUrls.length > 0) || post.videoUrl) && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Images */}
                      {post.mediaUrls?.map((url, index) => (
                        <div key={`image-${index}`} className="rounded-lg overflow-hidden">
                          <Image
                            src={url}
                            alt="Post media"
                            width={400}
                            height={300}
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      ))}
                      
                      {/* Video */}
                      {post.videoUrl && (
                        <div key="video" className="rounded-lg overflow-hidden">
                          <video
                            src={post.videoUrl}
                            controls
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Link Preview */}
                  {post.linkUrl && (
                    <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start space-x-4">
                        <div className="flex-1">
                          {post.linkTitle && (
                            <h4 className="font-semibold text-gray-900 mb-1">{post.linkTitle}</h4>
                          )}
                          {post.linkDescription && (
                            <p className="text-gray-600 text-sm mb-2">{post.linkDescription}</p>
                          )}
                          <a
                            href={post.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 text-sm"
                          >
                            {post.linkUrl}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}