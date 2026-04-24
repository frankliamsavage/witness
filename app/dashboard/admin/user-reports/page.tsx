'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

interface UserReport {
  id: string;
  category: string;
  reason: string;
  description: string;
  status: string;
  adminNotes?: string;
  createdAt: string;
  resolvedAt?: string;
  reportedUser: {
    id: string;
    username: string;
    email: string;
    profilePicture?: string;
    isVerified: boolean;
  };
  reporter: {
    id: string;
    username: string;
    email: string;
    profilePicture?: string;
  };
}

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  UNDER_REVIEW: 'bg-blue-100 text-blue-800',
  RESOLVED: 'bg-green-100 text-green-800',
  DISMISSED: 'bg-gray-100 text-gray-800'
};

const CATEGORY_LABELS = {
  HARASSMENT: 'Harassment/Bullying',
  HATE_SPEECH: 'Hate Speech',
  SPAM: 'Spam',
  INAPPROPRIATE_CONTENT: 'Inappropriate Content',
  FAKE_PROFILE: 'Fake Profile',
  IMPERSONATION: 'Impersonation',
  VIOLENCE_THREATS: 'Violence/Threats',
  SEXUAL_CONTENT: 'Sexual Content',
  SCAM_FRAUD: 'Scam/Fraud',
  OTHER: 'Other'
};

export default function AdminUserReportsPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isSignedIn) {
      checkAdminAccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const checkAdminAccess = async () => {
    try {
      const response = await fetch('/api/user');
      const data = await response.json();
      
      if (!data.isAdmin) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/dashboard');
    }
  };

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/report?status=${statusFilter}`);
      const data = await response.json();
      
      if (response.ok) {
        setReports(data.reports);
      } else {
        setError(data.error || 'Failed to load reports');
      }
    } catch (error) {
      setError('Failed to load reports');
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId: string, newStatus: string) => {
    try {
      setUpdating(true);
      const response = await fetch('/api/admin/reports', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId,
          status: newStatus,
          adminNotes: adminNotes.trim() || undefined
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSelectedReport(null);
        setAdminNotes('');
        loadReports(); // Refresh the list
      } else {
        setError(data.error || 'Failed to update report');
      }
    } catch (error) {
      setError('Failed to update report');
      console.error('Error updating report:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-200 via-amber-100 to-emerald-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">🚨 User Reports</h1>
          <p className="text-slate-600">Manage user reports and community violations</p>
        </div>

        {/* Status Filter */}
        <div className="bg-white/80 rounded-lg p-6 mb-6 shadow-lg">
          <div className="flex flex-wrap gap-2">
            {['PENDING', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED', 'ALL'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Reports List */}
        <div className="bg-white/80 rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Loading reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No reports found for the selected status.
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {reports.map((report) => (
                <div key={report.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[report.status as keyof typeof STATUS_COLORS]}`}>
                          {report.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                          {CATEGORY_LABELS[report.category as keyof typeof CATEGORY_LABELS]}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm font-medium text-slate-900">Reported User:</p>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">@{report.reportedUser.username}</span>
                            {report.reportedUser.isVerified && <span className="text-blue-500">✓</span>}
                          </div>
                          <p className="text-xs text-slate-500">{report.reportedUser.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">Reporter:</p>
                          <p className="font-medium">@{report.reporter.username}</p>
                          <p className="text-xs text-slate-500">{report.reporter.email}</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm font-medium text-slate-900 mb-1">Reason:</p>
                        <p className="text-slate-700">{report.reason}</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-slate-900 mb-1">Description:</p>
                        <p className="text-slate-700 text-sm">{report.description}</p>
                      </div>

                      {report.adminNotes && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                          <p className="text-sm font-medium text-blue-900 mb-1">Admin Notes:</p>
                          <p className="text-blue-800 text-sm">{report.adminNotes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4 flex flex-col gap-2">
                      <button
                        onClick={() => router.push(`/u/${report.reportedUser.username}`)}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        View Profile
                      </button>
                      {report.status === 'PENDING' && (
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setAdminNotes(report.adminNotes || '');
                          }}
                          className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          Take Action
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-bold mb-4">Take Action on Report</h3>
              
              <div className="mb-4">
                <p className="text-sm text-slate-600 mb-2">
                  Report against @{selectedReport.reportedUser.username}
                </p>
                <p className="text-sm font-medium">{selectedReport.reason}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add notes about your decision..."
                />
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => updateReportStatus(selectedReport.id, 'UNDER_REVIEW')}
                  disabled={updating}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                >
                  Review
                </button>
                <button
                  onClick={() => updateReportStatus(selectedReport.id, 'RESOLVED')}
                  disabled={updating}
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300 transition-colors"
                >
                  Resolve
                </button>
                <button
                  onClick={() => updateReportStatus(selectedReport.id, 'DISMISSED')}
                  disabled={updating}
                  className="flex-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-300 transition-colors"
                >
                  Dismiss
                </button>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="w-full px-4 py-2 border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}