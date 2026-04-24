'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { checkAdminStatus } from '@/app/actions/adminActions';

interface PostReport {
  id: string;
  category: string;
  reason: string;
  description: string;
  screenshot?: string;
  status: string;
  adminNotes?: string;
  createdAt: string;
  resolvedAt?: string;
  post: {
    id: string;
    content: string;
    imageUrls?: string[];
    videoUrl?: string;
    author: {
      id: string;
      username: string;
      email: string;
      profilePicture?: string;
    };
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
  COPYRIGHT_INFRINGEMENT: 'Copyright Infringement',
  DEFAMATION: 'Defamation/Libel',
  HARASSMENT: 'Harassment/Cyberbullying', 
  HATE_SPEECH: 'Hate Speech',
  VIOLENCE_THREATS: 'Violence/Threats',
  PRIVACY_VIOLATION: 'Privacy Violation',
  FRAUD_SCAM: 'Fraud/Scam',
  SEXUAL_CONTENT: 'Sexual Content',
  TERRORISM: 'Terrorism/Extremism',
  DRUG_SALES: 'Drug Sales',
  WEAPONS_SALES: 'Weapons Sales',
  HUMAN_TRAFFICKING: 'Human Trafficking',
  MINOR_EXPLOITATION: 'Minor Exploitation',
  DOXXING: 'Doxxing/Personal Info',
  REVENGE_PORN: 'Revenge Porn',
  OTHER: 'Other Legal Violation'
};

export default function AdminPostReportsPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<PostReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [selectedReport, setSelectedReport] = useState<PostReport | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [actionReason, setActionReason] = useState('');

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
    if (isAdminVerified) {
      loadReports();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, isAdminVerified]);

  const checkAdminAccess = async () => {
    try {
      console.log('🔐 Checking admin access...');
      const result = await checkAdminStatus();
      
      console.log('👤 Admin status result:', result);
      
      if (!result.isAdmin) {
        console.log('❌ User is not admin, redirecting to dashboard');
        router.push('/dashboard');
      } else {
        console.log('✅ User is admin, access granted');
        setIsAdminVerified(true);
      }
    } catch (error) {
      console.error('❌ Error checking admin access:', error);
      // Don't redirect on error, just log it
      console.log('🚨 Admin check failed but staying on page');
    }
  };

  const loadReports = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading post reports with status:', statusFilter);
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`/api/admin/post-reports?status=${statusFilter}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      const data = await response.json();
      
      console.log('📋 Post reports API response:', { status: response.status, data });
      setDebugInfo({ status: response.status, data, timestamp: new Date().toISOString() });
      
      if (response.ok) {
        setReports(data.reports);
        console.log('✅ Loaded reports:', data.reports);
      } else {
        setError(data.error || 'Failed to load reports');
        console.error('❌ API error:', data.error);
      }
    } catch (error) {
      setError('Failed to load reports');
      console.error('❌ Error loading reports:', error);
      setDebugInfo({ 
        error: error instanceof Error ? error.message : String(error), 
        timestamp: new Date().toISOString() 
      });
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId: string, newStatus: string) => {
    if (!actionReason.trim()) {
      alert('Please provide a reason for this action.');
      return;
    }

    try {
      setUpdating(true);
      
      // Create a comprehensive admin note with timestamp and action details
      const timestamp = new Date().toISOString();
      const adminNote = `[${timestamp}] STATUS: ${newStatus}\nREASON: ${actionReason.trim()}\nADMIN NOTES: ${adminNotes.trim() || 'None provided'}`;
      
      const response = await fetch('/api/admin/post-reports', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId,
          status: newStatus,
          adminNotes: adminNote
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSelectedReport(null);
        setAdminNotes('');
        setActionReason('');
        setSelectedAction('');
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
          <h1 className="text-4xl font-bold text-slate-900 mb-2">📋 Post Reports</h1>
          <p className="text-slate-600">Manage post reports and legal violation claims</p>
        </div>

        {/* Status Filter */}
        <div className="bg-white/80 rounded-lg p-6 mb-6 shadow-lg">
          <div className="flex flex-wrap gap-2">
            {['ALL', 'PENDING', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Current filter: <strong>{statusFilter}</strong> | Admin verified: <strong>{isAdminVerified ? 'Yes' : 'No'}</strong>
          </p>
          <button
            onClick={async () => {
              try {
                console.log('🧪 Testing admin status check...');
                const result = await checkAdminStatus();
                console.log('👤 Admin status result:', result);
                alert(`Admin check works! Admin: ${result.isAdmin}, Username: ${result.username}`);
              } catch (error) {
                console.error('🚨 Admin status check failed:', error);
                alert(`Admin status check failed: ${error}`);
              }
            }}
            className="mt-2 px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Test Admin Status
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {debugInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <details>
              <summary className="cursor-pointer text-blue-700 font-medium">Debug Information (Click to expand)</summary>
              <pre className="text-xs mt-2 text-blue-800 overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* Reports List */}
        <div className="bg-white/80 rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p>Loading reports...</p>
              <p className="text-xs text-gray-500 mt-2">Status filter: {statusFilter}</p>
              <p className="text-xs text-gray-500">Admin verified: {isAdminVerified ? 'Yes' : 'No'}</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <p>No reports found for status: <strong>{statusFilter}</strong></p>
              <p className="text-xs mt-2">Try clicking "ALL" to see all reports regardless of status</p>
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
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                          {CATEGORY_LABELS[report.category as keyof typeof CATEGORY_LABELS]}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm font-medium text-slate-900">Post Author:</p>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">@{report.post.author.username}</span>
                          </div>
                          <p className="text-xs text-slate-500">{report.post.author.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">Reporter:</p>
                          <p className="font-medium">@{report.reporter.username}</p>
                          <p className="text-xs text-slate-500">{report.reporter.email}</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm font-medium text-slate-900 mb-1">Violation Claimed:</p>
                        <p className="text-slate-700">{report.reason}</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-slate-900 mb-1">Details:</p>
                        <p className="text-slate-700 text-sm">{report.description}</p>
                      </div>

                      {/* Post Content Preview */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                        <p className="text-sm font-medium text-slate-900 mb-2">Reported Post Content:</p>
                        <p className="text-slate-700 text-sm mb-2">{report.post.content}</p>
                        {((report.post.imageUrls && report.post.imageUrls.length > 0) || report.post.videoUrl) && (
                          <div className="mt-2">
                            {report.post.imageUrls && report.post.imageUrls.length > 0 && (
                              <div>
                                <img 
                                  src={report.post.imageUrls[0]} 
                                  alt="Post media" 
                                  className="max-w-xs h-32 object-cover rounded border"
                                />
                                {report.post.imageUrls.length > 1 && (
                                  <p className="text-xs text-gray-500 mt-1">+{report.post.imageUrls.length - 1} more images</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">Media Type: images</p>
                              </div>
                            )}
                            {report.post.videoUrl && (
                              <div>
                                <video 
                                  src={report.post.videoUrl} 
                                  className="max-w-xs h-32 object-cover rounded border"
                                  controls={false}
                                />
                                <p className="text-xs text-gray-500 mt-1">Media Type: video</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {report.adminNotes && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                          <p className="text-sm font-medium text-orange-900 mb-1">Admin Notes:</p>
                          <p className="text-orange-800 text-sm">{report.adminNotes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4 flex flex-col gap-2 min-w-[120px]">
                      <button
                        onClick={() => router.push(`/u/${report.post.author.username}`)}
                        className="px-3 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        View Author
                      </button>
                      <button
                        onClick={() => window.open(`/newsfeed`, '_blank')}
                        className="px-3 py-2 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                      >
                        View Post
                      </button>
                      
                      {/* Always show action button for all statuses */}
                      <button
                        onClick={() => {
                          console.log('Action button clicked for report:', report.id);
                          setSelectedReport(report);
                          setAdminNotes(report.adminNotes || '');
                        }}
                        className="px-3 py-2 text-xs bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors font-medium border-2 border-orange-400"
                        title={`Current status: ${report.status}`}
                      >
                        {report.status === 'PENDING' ? 'Take Action' :
                         report.status === 'UNDER_REVIEW' ? 'Update Status' :
                         report.status === 'RESOLVED' ? 'Reopen Case' :
                         report.status === 'DISMISSED' ? 'Reopen Case' : 'Manage'}
                      </button>
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
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h3 className="text-xl font-bold mb-4">📋 Review Report</h3>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-2">
                  <strong>Post by:</strong> @{selectedReport.post.author.username}
                </p>
                <p className="text-sm text-slate-600 mb-2">
                  <strong>Reported by:</strong> @{selectedReport.reporter.username}
                </p>
                <p className="text-sm font-medium">
                  <strong>Violation:</strong> {selectedReport.reason}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Reported on: {new Date(selectedReport.createdAt).toLocaleString()}
                </p>
                {selectedReport.description && (
                  <p className="text-sm text-slate-600 mt-2">
                    <strong>Details:</strong> {selectedReport.description}
                  </p>
                )}
                
                {selectedReport.screenshot && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-slate-900 mb-2">Evidence Screenshot:</p>
                    <div className="border rounded-lg overflow-hidden bg-gray-50">
                      <img 
                        src={selectedReport.screenshot} 
                        alt="Post evidence screenshot"
                        className="w-full max-w-lg mx-auto block"
                        style={{ maxHeight: '400px', objectFit: 'contain' }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Screenshot captured at time of report submission</p>
                  </div>
                )}
              </div>

              {/* Show existing admin notes/history */}
              {selectedReport.adminNotes && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">📜 Review History</h4>
                  <pre className="text-xs text-blue-800 whitespace-pre-wrap">{selectedReport.adminNotes}</pre>
                </div>
              )}

              {!selectedAction ? (
                <>
                  <h4 className="font-medium mb-3">Choose an action:</h4>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {selectedReport.status === 'PENDING' && (
                      <button
                        onClick={() => setSelectedAction('UNDER_REVIEW')}
                        className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        🔍 Start Review
                      </button>
                    )}
                    
                    {(selectedReport.status === 'RESOLVED' || selectedReport.status === 'DISMISSED') && (
                      <button
                        onClick={() => setSelectedAction('UNDER_REVIEW')}
                        className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        🔍 Reopen for Review
                      </button>
                    )}
                    
                    <button
                      onClick={() => setSelectedAction('DISMISSED')}
                      className="p-3 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                      disabled={selectedReport.status === 'DISMISSED'}
                    >
                      ❌ {selectedReport.status === 'DISMISSED' ? 'Already Dismissed' : 'Dismiss Report'}
                    </button>
                    <button
                      onClick={() => setSelectedAction('RESOLVED')}
                      className="p-3 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      disabled={selectedReport.status === 'RESOLVED'}
                    >
                      ✅ {selectedReport.status === 'RESOLVED' ? 'Already Resolved' : 'Resolve & Take Action'}
                    </button>
                    
                    {selectedReport.status !== 'PENDING' && (
                      <button
                        onClick={() => setSelectedAction('UPDATE')}
                        className="p-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                      >
                        📝 Add Update/Note
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-900">
                      Action: {selectedAction === 'UPDATE' ? 'Adding Update/Note' : 
                              selectedAction === 'UNDER_REVIEW' && (selectedReport.status === 'RESOLVED' || selectedReport.status === 'DISMISSED') ? 'Reopening for Review' :
                              `Mark as ${selectedAction.replace('_', ' ')}`}
                    </h4>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {selectedAction === 'UNDER_REVIEW' && selectedReport.status === 'PENDING' && 'Why is this under review? What needs to be investigated?'}
                      {selectedAction === 'UNDER_REVIEW' && (selectedReport.status === 'RESOLVED' || selectedReport.status === 'DISMISSED') && 'Why are you reopening this case? What new information requires review?'}
                      {selectedAction === 'DISMISSED' && 'Why is this report being dismissed? What rule was not violated?'}
                      {selectedAction === 'RESOLVED' && 'What action was taken? How was this resolved?'}
                      {selectedAction === 'UPDATE' && 'Add your update or note to the case:'}
                      <span className="text-red-500"> *</span>
                    </label>
                    <textarea
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder={
                        selectedAction === 'UNDER_REVIEW' ? 'e.g., Need to verify if content violates community guidelines...' :
                        selectedAction === 'DISMISSED' ? 'e.g., Content does not violate our terms of service...' :
                        selectedAction === 'RESOLVED' ? 'e.g., Post removed, user warned for violation of...' :
                        'e.g., Investigation ongoing, contacted legal team...'
                      }
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Any additional context or notes..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => updateReportStatus(selectedReport.id, selectedAction)}
                      disabled={updating || !actionReason.trim()}
                      className="flex-1 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-orange-300 transition-colors"
                    >
                      {updating ? 'Updating...' : `Confirm ${selectedAction.replace('_', ' ')}`}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAction('');
                        setActionReason('');
                        setAdminNotes('');
                      }}
                      className="px-4 py-2 border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors"
                    >
                      Back
                    </button>
                  </div>
                </>
              )}

              <button
                onClick={() => {
                  setSelectedReport(null);
                  setSelectedAction('');
                  setActionReason('');
                  setAdminNotes('');
                }}
                className="w-full mt-4 px-4 py-2 border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors"
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