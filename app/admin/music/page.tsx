'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface MusicSubmission {
  id: string;
  title: string;
  artist: string;
  genre: string;
  description: string;
  audioFile: string;
  coverImage: string | null;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  adminNotes: string | null;
  price: number;
  downloads: number;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export default function AdminMusicReview() {
  const { user, isLoaded } = useUser();
  const [submissions, setSubmissions] = useState<MusicSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedSubmission, setSelectedSubmission] = useState<MusicSubmission | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isLoaded && !user) {
    redirect('/sign-in');
  }

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/music');
      if (!response.ok) throw new Error('Failed to fetch submissions');
      const data = await response.json();
      setSubmissions(data.submissions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (submissionId: string, status: 'approved' | 'rejected') => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/music', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          status,
          adminNotes: reviewNotes,
        }),
      });

      if (!response.ok) throw new Error('Failed to update submission');

      // Update local state
      setSubmissions(prev =>
        prev.map(sub =>
          sub.id === submissionId
            ? { ...sub, status, adminNotes: reviewNotes }
            : sub
        )
      );

      setSelectedSubmission(null);
      setReviewNotes('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSubmissions = submissions.filter(sub =>
    filter === 'all' || sub.status === filter
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to Admin
          </Link>
          <h1 className="text-4xl font-bold text-white">Music Submissions Review</h1>
          <p className="text-slate-300 mt-2">Review and approve/reject user music submissions</p>
        </div>

        {error && (
          <div className="p-4 bg-red-900 border border-red-700 text-red-200 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-700">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                filter === tab
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {filter === tab && (
                <span className="ml-2 text-sm bg-blue-600 px-2 py-1 rounded">
                  {filteredSubmissions.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">⏳</div>
            <p className="text-slate-300 mt-4">Loading submissions...</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="bg-slate-800 rounded-xl p-12 text-center border border-slate-700">
            <p className="text-slate-300 text-lg">No submissions to review</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSubmissions.map(submission => (
              <div
                key={submission.id}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Info Section */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{submission.title}</h3>
                        <p className="text-slate-400">by {submission.artist}</p>
                        <p className="text-slate-500 text-sm mt-1">{submission.genre}</p>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          submission.status === 'approved'
                            ? 'bg-green-900 text-green-200'
                            : submission.status === 'rejected'
                            ? 'bg-red-900 text-red-200'
                            : 'bg-yellow-900 text-yellow-200'
                        }`}
                      >
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </span>
                    </div>

                    {submission.description && (
                      <p className="text-slate-300 text-sm mb-4">{submission.description}</p>
                    )}

                    <div className="space-y-2 text-sm text-slate-400">
                      <p>
                        <span className="font-medium">Submitted by:</span> {submission.user.username || submission.user.email}
                      </p>
                      <p>
                        <span className="font-medium">Date:</span> {new Date(submission.createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-medium">Price:</span> ${submission.price.toFixed(2)}
                      </p>
                      {submission.adminNotes && (
                        <p>
                          <span className="font-medium">Admin Notes:</span> {submission.adminNotes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Player Section */}
                  <div className="bg-slate-700 rounded-lg p-4">
                    {submission.coverImage && (
                      <img
                        src={submission.coverImage}
                        alt={submission.title}
                        className="w-full h-auto rounded-lg mb-4 object-cover aspect-square"
                      />
                    )}
                    <audio controls className="w-full mb-4">
                      <source src={submission.audioFile} type="audio/mpeg" />
                      Your browser does not support audio.
                    </audio>

                    {submission.status === 'pending' && (
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setReviewNotes('');
                          }}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setReviewNotes('');
                          }}
                          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">
                {selectedSubmission.status === 'pending' ? 'Review Submission' : 'Update Review'}
              </h2>

              <div className="mb-4">
                <h3 className="text-white font-semibold mb-2">{selectedSubmission.title}</h3>
                <p className="text-slate-400 text-sm">by {selectedSubmission.artist}</p>
              </div>

              <textarea
                value={reviewNotes}
                onChange={e => setReviewNotes(e.target.value)}
                placeholder="Add notes (optional)"
                rows={3}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none resize-none mb-4"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => handleReview(selectedSubmission.id, 'approved')}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-600 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReview(selectedSubmission.id, 'rejected')}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-slate-600 transition"
                >
                  Reject
                </button>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:bg-slate-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
