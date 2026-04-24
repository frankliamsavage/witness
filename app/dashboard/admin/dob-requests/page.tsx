'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { checkAdminStatus } from '@/app/actions/adminActions';
import DobRequestReview from '@/components/admin/DobRequestReview';

export default function AdminDobReviewPage() {
  const { user } = useUser();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) {
        router.push('/dashboard');
        return;
      }

      try {
        const adminCheck = await checkAdminStatus();
        if (!adminCheck.isAdmin) {
          router.push('/dashboard');
          return;
        }
        setIsAdmin(true);
      } catch (error) {
        console.error('Admin check failed:', error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard/admin')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Admin Dashboard
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Admin: {user?.firstName} {user?.lastName}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6">
        <DobRequestReview />
      </div>
    </div>
  );
}