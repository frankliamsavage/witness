'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

const REPORT_CATEGORIES = [
  { value: 'HARASSMENT', label: 'Harassment or Bullying' },
  { value: 'HATE_SPEECH', label: 'Hate Speech' },
  { value: 'SPAM', label: 'Spam or Unwanted Content' },
  { value: 'INAPPROPRIATE_CONTENT', label: 'Inappropriate Content' },
  { value: 'FAKE_PROFILE', label: 'Fake Profile' },
  { value: 'IMPERSONATION', label: 'Impersonation' },
  { value: 'VIOLENCE_THREATS', label: 'Violence or Threats' },
  { value: 'SEXUAL_CONTENT', label: 'Sexual Content' },
  { value: 'SCAM_FRAUD', label: 'Scam or Fraud' },
  { value: 'OTHER', label: 'Other' },
];

function ReportUserForm() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reportedUsername, setReportedUsername] = useState('');
  const [reportedUserId, setReportedUserId] = useState('');
  const [category, setCategory] = useState('');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in?redirect_url=' + encodeURIComponent('/report-user'));
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    const userId = searchParams.get('userId');
    const username = searchParams.get('username');
    
    if (userId) setReportedUserId(userId);
    if (username) setReportedUsername(username);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/user/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportedUserId,
          reportedUsername,
          category,
          reason,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit report');
      }

      setSuccess(true);
      
      // Redirect after successful submission
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-pink-200 via-amber-100 to-emerald-200 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-pink-200 via-amber-100 to-emerald-200 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white/80 rounded-xl p-8 shadow-lg text-center">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Report Submitted</h1>
          <p className="text-slate-700 mb-4">
            Thank you for reporting this issue. Our admin team will review it promptly.
          </p>
          <p className="text-sm text-slate-500">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-200 via-amber-100 to-emerald-200">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-slate-900 mb-6 text-center">
            🚨 Report User
          </h1>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-red-800 mb-2">Important Notice</h2>
            <p className="text-red-700 text-sm">
              Please only submit reports for genuine violations of our community guidelines. 
              False reports may result in action against your account.
            </p>
          </div>

          {reportedUsername && (
            <div className="bg-slate-100 rounded-lg p-4 mb-6">
              <p className="text-slate-700">
                <strong>Reporting:</strong> @{reportedUsername}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!reportedUserId && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Username to Report *
                </label>
                <input
                  type="text"
                  value={reportedUsername}
                  onChange={(e) => setReportedUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Report Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {REPORT_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Brief Reason *
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Brief summary of the issue"
                maxLength={100}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-slate-500 mt-1">{reason.length}/100 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Detailed Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                placeholder="Please provide specific details about the violation, including when it occurred and any relevant context..."
                maxLength={1000}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                required
              />
              <p className="text-xs text-slate-500 mt-1">{description.length}/1000 characters</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !category || !reason || !description}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ReportUserPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-tr from-pink-200 via-amber-100 to-emerald-200 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    }>
      <ReportUserForm />
    </Suspense>
  );
}