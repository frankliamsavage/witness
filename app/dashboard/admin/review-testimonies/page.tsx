'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { checkAdminStatus } from '@/app/actions/adminActions';

type PendingTestimony = {
  id: string;
  content: string;
  authorName: string;
  contactEmail?: string;
  isGuest: boolean;
  createdAt: string;
};

export default function ReviewTestimoniesPage() {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingTestimonies, setPendingTestimonies] = useState<PendingTestimony[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);

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
        await loadPendingTestimonies();
      }
    } catch (error) {
      console.error('Failed to verify admin status:', error);
      setIsAdmin(false);
    }
    setLoading(false);
  }

  async function loadPendingTestimonies() {
    try {
      const response = await fetch('/api/admin/testimonies/pending');
      if (response.ok) {
        const data = await response.json();
        setPendingTestimonies(data.testimonies || []);
      }
    } catch (error) {
      console.error('Failed to load pending testimonies:', error);
    }
  }

  async function handleTestimonyAction(id: string, action: 'approve' | 'reject') {
    setProcessingId(id);
    try {
      const response = await fetch('/api/admin/testimonies/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, action }),
      });

      if (response.ok) {
        // Remove the testimony from the list
        setPendingTestimonies(prev => prev.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Failed to process testimony:', error);
    }
    setProcessingId(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pending testimonies...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg border-2 border-red-200">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-900 mb-2">Access Denied</h1>
          <p className="text-red-600">Administrator privileges required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-purple-600 text-white rounded-xl p-6 mb-8 shadow-lg">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span>📖</span>
            Review Pending Testimonies
          </h1>
          <p className="text-purple-100 mt-2">
            Review and approve testimonies from anonymous guests
          </p>
        </div>

        {pendingTestimonies.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-lg">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h2>
            <p className="text-gray-600">No pending testimonies to review at this time.</p>
            <a
              href="/dashboard/admin"
              className="inline-block mt-4 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Admin Dashboard
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingTestimonies.map((testimony) => (
              <div key={testimony.id} className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {testimony.authorName} {testimony.isGuest && '(Guest)'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(testimony.createdAt).toLocaleDateString()}
                    </p>
                    {testimony.contactEmail && (
                      <p className="text-sm text-gray-600">{testimony.contactEmail}</p>
                    )}
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    Pending Review
                  </span>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Testimony Content:</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{testimony.content}</p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleTestimonyAction(testimony.id, 'approve')}
                    disabled={processingId === testimony.id}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {processingId === testimony.id ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </div>
                    ) : (
                      '✅ Approve & Publish'
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleTestimonyAction(testimony.id, 'reject')}
                    disabled={processingId === testimony.id}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    ❌ Reject & Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}