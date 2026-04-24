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
}

export default function MySubmissions() {
  const { user, isLoaded } = useUser();
  const [submissions, setSubmissions] = useState<MusicSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playing, setPlaying] = useState<string | null>(null);

  if (isLoaded && !user) {
    redirect('/sign-in');
  }

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/music/submissions');
      if (!response.ok) throw new Error('Failed to fetch submissions');
      const data = await response.json();
      setSubmissions(data.submissions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-900 text-green-200';
      case 'rejected':
        return 'bg-red-900 text-red-200';
      case 'pending':
        return 'bg-yellow-900 text-yellow-200';
      default:
        return 'bg-slate-900 text-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/music-department" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to Music Department
          </Link>
          <h1 className="text-4xl font-bold text-white">My Submissions</h1>
          <p className="text-slate-300 mt-2">Track your song submissions and their status</p>
        </div>

        {error && (
          <div className="p-4 bg-red-900 border border-red-700 text-red-200 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">⏳</div>
            <p className="text-slate-300 mt-4">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-slate-800 rounded-xl p-12 text-center border border-slate-700">
            <p className="text-slate-300 text-lg">No submissions yet</p>
            <Link
              href="/music-department"
              className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Submit Your First Song
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div key={submission.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{submission.title}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(submission.status)}`}>
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-slate-400">by {submission.artist}</p>
                    <p className="text-slate-500 text-sm mt-1">{submission.genre}</p>
                    {submission.description && (
                      <p className="text-slate-300 text-sm mt-3">{submission.description}</p>
                    )}
                    <p className="text-slate-500 text-xs mt-4">
                      Submitted: {new Date(submission.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Music Player */}
                  <div className="bg-slate-700 rounded-lg p-4 w-64">
                    {submission.coverImage && (
                      <img
                        src={submission.coverImage}
                        alt={submission.title}
                        className="w-full h-auto rounded-lg mb-4 object-cover aspect-square"
                      />
                    )}
                    <audio
                      controls
                      className="w-full"
                      onPlay={() => setPlaying(submission.id)}
                      onPause={() => setPlaying(null)}
                    >
                      <source src={submission.audioFile} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
