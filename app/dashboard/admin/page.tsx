'use client';
import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { checkAdminStatus } from '@/app/actions/adminActions';

type ModerationStats = {
  videos: number;
  posts: number;
  testimonies: number;
  total: number;
};

type DetailedBreakdown = {
  textPosts: number;
  imagePosts: number;
  videoPosts: number;
  linkPosts: number;
  pollPosts: number;
  totalPosts: number;
  videos: number;
  testimonies: number;
};

type PendingContent = {
  pendingTestimonies: number;
  pendingPosts: number;
  reportedContent: number;
  pendingPostReports: number;
  totalPending: number;
};

export default function AdminModerationPage() {
  const { user } = useUser();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [moderationStats, setModerationStats] = useState<ModerationStats | null>(null);
  const [detailedBreakdown, setDetailedBreakdown] = useState<DetailedBreakdown | null>(null);
  const [pendingContent, setPendingContent] = useState<PendingContent | null>(null);

  useEffect(() => {
    const initializeAdmin = async () => {
      if (user) {
        await checkAdminAccess();
      }
    };
    
    initializeAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);



  async function checkAdminAccess() {
    try {
      const status = await checkAdminStatus();
      setIsAdmin(status.isAdmin);
      
      if (status.isAdmin) {
        console.log('✅ Admin dashboard access granted:', { username: status.username });
        await loadModerationData();
        await loadPendingContent();
      } else {
        console.log('❌ Access denied: User is not an admin');
      }
    } catch (error) {
      console.error('Failed to verify admin status:', error);
      setIsAdmin(false);
    }
    setLoading(false);
  }

  async function loadModerationData() {
    try {
      const response = await fetch('/api/admin/moderate');
      if (response.ok) {
        const data = await response.json();
        setModerationStats(data.moderatableContent);
        setDetailedBreakdown(data.detailedBreakdown);
        console.log('📊 Moderation stats loaded:', data.moderatableContent);
        console.log('📋 Detailed breakdown:', data.detailedBreakdown);
      }
    } catch (error) {
      console.error('Failed to load moderation data:', error);
    }
  }

  async function loadPendingContent() {
    try {
      const response = await fetch('/api/admin/pending');
      if (response.ok) {
        const data = await response.json();
        setPendingContent(data);
        console.log('📋 Pending content loaded:', data);
      }
    } catch (error) {
      console.error('Failed to load pending content:', error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h1>
          <p className="text-gray-600">Please sign in to access the admin panel.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg border-2 border-red-200">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-900 mb-2">Access Denied</h1>
          <p className="text-red-600 mb-4">Administrator privileges required to access this page.</p>
          <p className="text-sm text-gray-500">If you believe this is an error, please contact system administrators.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Admin Header */}
        <div className="bg-red-600 text-white rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <span>🛡️</span>
                Admin Moderation Panel
              </h1>
              <p className="text-red-100 mt-2">
                Content moderation and spam removal dashboard
              </p>
            </div>
            <div className="bg-red-700 px-4 py-2 rounded-lg">
              <div className="text-sm font-medium">Admin User</div>
              <div className="text-red-100">{user.username || user.firstName || 'Administrator'}</div>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        {moderationStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Videos</p>
                  <p className="text-2xl font-bold text-gray-900">{moderationStats.videos}</p>
                </div>
                <div className="text-3xl">🎥</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Posts</p>
                  <p className="text-2xl font-bold text-gray-900">{moderationStats.posts}</p>
                </div>
                <div className="text-3xl">📝</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Testimonies</p>
                  <p className="text-2xl font-bold text-gray-900">{moderationStats.testimonies}</p>
                </div>
                <div className="text-3xl">📖</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Content</p>
                  <p className="text-2xl font-bold text-gray-900">{moderationStats.total}</p>
                </div>
                <div className="text-3xl">📊</div>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Content Breakdown */}
        {detailedBreakdown && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📋</span>
              Content Breakdown
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-1">📝</div>
                <div className="text-lg font-bold text-blue-600">{detailedBreakdown.textPosts}</div>
                <div className="text-xs text-gray-600">Text Posts</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl mb-1">🖼️</div>
                <div className="text-lg font-bold text-green-600">{detailedBreakdown.imagePosts}</div>
                <div className="text-xs text-gray-600">Image Posts</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl mb-1">🎬</div>
                <div className="text-lg font-bold text-purple-600">{detailedBreakdown.videoPosts}</div>
                <div className="text-xs text-gray-600">Video Posts</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl mb-1">🔗</div>
                <div className="text-lg font-bold text-orange-600">{detailedBreakdown.linkPosts}</div>
                <div className="text-xs text-gray-600">Link Posts</div>
              </div>
              <div className="text-center p-3 bg-pink-50 rounded-lg">
                <div className="text-2xl mb-1">📊</div>
                <div className="text-lg font-bold text-pink-600">{detailedBreakdown.pollPosts}</div>
                <div className="text-xs text-gray-600">Poll Posts</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl mb-1">📹</div>
                <div className="text-lg font-bold text-red-600">{detailedBreakdown.videos}</div>
                <div className="text-xs text-gray-600">Videos (old)</div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>⚡</span>
            Quick Actions
            {pendingContent && pendingContent.totalPending > 0 && (
              <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full ml-2">
                {pendingContent.totalPending} pending
              </span>
            )}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <a
              href="/dashboard/newsfeed"
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-colors relative"
            >
              <div className="text-2xl mb-2">📰</div>
              <div className="font-medium">Moderate News Feed</div>
              <div className="text-sm text-blue-100">Review and delete posts/videos</div>
              {pendingContent && pendingContent.pendingPosts > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {pendingContent.pendingPosts}
                </span>
              )}
            </a>
            <button
              onClick={() => router.push('/dashboard/admin/competition')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-lg text-center transition-colors relative w-full"
            >
              <div className="text-2xl mb-2">🏆</div>
              <div className="font-medium">Competition Management</div>
              <div className="text-sm text-emerald-100">Manage hub build contest</div>
            </button>
            <a
              href="/dashboard/admin/review-testimonies"
              className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center transition-colors relative"
            >
              <div className="text-2xl mb-2">📖</div>
              <div className="font-medium">Review Testimonies</div>
              <div className="text-sm text-purple-100">Review pending testimonies</div>
              {pendingContent && pendingContent.pendingTestimonies > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {pendingContent.pendingTestimonies}
                </span>
              )}
            </a>
            <button
              onClick={() => router.push('/dashboard/admin/dob-requests')}
              className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition-colors relative w-full"
            >
              <div className="text-2xl mb-2">🔐</div>
              <div className="font-medium">DOB Verification</div>
              <div className="text-sm text-green-100">Review ID documents</div>
            </button>
            <button
              onClick={() => router.push('/dashboard/admin/user-reports')}
              className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg text-center transition-colors relative w-full"
            >
              <div className="text-2xl mb-2">🚨</div>
              <div className="font-medium">User Reports</div>
              <div className="text-sm text-red-100">Review reported users</div>
              {pendingContent && pendingContent.reportedContent > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                  {pendingContent.reportedContent}
                </span>
              )}
            </button>
            <button
              onClick={() => router.push('/dashboard/admin/post-reports')}
              className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg text-center transition-colors relative w-full"
            >
              <div className="text-2xl mb-2">📋</div>
              <div className="font-medium">Post Reports</div>
              <div className="text-sm text-orange-100">Review reported posts</div>
              {pendingContent && pendingContent.pendingPostReports > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                  {pendingContent.pendingPostReports}
                </span>
              )}
            </button>
          </div>


        </div>

        {/* Moderation Guidelines */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
            <span>⚠️</span>
            Moderation Guidelines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Content to Remove:</h3>
              <ul className="space-y-1 text-yellow-700">
                <li>• Spam or promotional content</li>
                <li>• Illegal or harmful material</li>
                <li>• Hate speech or harassment</li>
                <li>• False or misleading information</li>
                <li>• Inappropriate images/videos</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Best Practices:</h3>
              <ul className="space-y-1 text-yellow-700">
                <li>• Review content carefully before deletion</li>
                <li>• Document reasons for removal</li>
                <li>• Be consistent with enforcement</li>
                <li>• Consider warning users first when appropriate</li>
                <li>• Focus on community safety</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}