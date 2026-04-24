'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface PendingTestimony {
  id: string;
  content: string;
  authorName: string;
  contactEmail?: string;
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export default function AdminTestimoniesPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [pendingTestimonies, setPendingTestimonies] = useState<PendingTestimony[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && (!user || user.publicMetadata?.role !== 'admin')) {
      router.push('/dashboard');
      return;
    }

    if (user) {
      fetchPendingTestimonies();
    }
  }, [user, isLoaded, router]);

  const fetchPendingTestimonies = async () => {
    try {
      const response = await fetch('/api/admin/testimonies');
      if (response.ok) {
        const data = await response.json();
        setPendingTestimonies(data.testimonies || []);
      }
    } catch (error) {
      console.error('Error fetching pending testimonies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (testimonyId: string, action: 'approve' | 'reject') => {
    setProcessing(testimonyId);
    try {
      const response = await fetch('/api/admin/testimonies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testimonyId, action }),
      });

      if (response.ok) {
        // Remove from pending list
        setPendingTestimonies(prev => prev.filter(t => t.id !== testimonyId));
      } else {
        alert('Failed to process testimony');
      }
    } catch (error) {
      console.error('Error processing testimony:', error);
      alert('Error processing testimony');
    } finally {
      setProcessing(null);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-900 mx-auto mb-4"></div>
            <p className="text-xl text-slate-700">Loading admin panel...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.publicMetadata?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-6xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-slate-700">You don&apos;t have admin privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Testimony Moderation</h1>
          <p className="text-slate-600">Review and approve pending anonymous testimonies</p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              📝 <strong>{pendingTestimonies.length}</strong> testimonies awaiting review
            </p>
          </div>
        </div>

        {/* Pending Testimonies */}
        {pendingTestimonies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">All Caught Up!</h2>
            <p className="text-slate-600">No pending testimonies to review.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingTestimonies.map((testimony) => (
              <div key={testimony.id} className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        Anonymous Testimony #{testimony.id.slice(-8)}
                      </h3>
                      <p className="text-sm text-slate-600">
                        Submitted: {new Date(testimony.createdAt).toLocaleString()}
                      </p>
                      {testimony.contactEmail && (
                        <p className="text-sm text-slate-600">
                          Contact: {testimony.contactEmail}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                        PENDING
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="prose prose-slate max-w-none mb-6">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {testimony.content}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleApproval(testimony.id, 'approve')}
                      disabled={processing === testimony.id}
                      className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing === testimony.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <span>✅</span>
                      )}
                      Approve & Publish
                    </button>
                    
                    <button
                      onClick={() => handleApproval(testimony.id, 'reject')}
                      disabled={processing === testimony.id}
                      className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>❌</span>
                      Reject
                    </button>

                    <div className="ml-auto text-sm text-slate-500">
                      Author: {testimony.authorName}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Dashboard */}
        <div className="mt-12 text-center">
          <button
            onClick={() => router.push('/dashboard/admin')}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium"
          >
            ← Back to Admin Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}