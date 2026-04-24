'use client';

import { useState, useEffect } from 'react';

interface DobChangeRequest {
  id: string;
  user: {
    username: string;
    email: string;
  };
  currentDOB: string;
  requestedDOB: string | null;
  reason: string;
  status: string;
  idDocumentType: string | null;
  idDocumentUrl: string | null;
  idDocumentHash: string | null;
  idVerified: boolean;
  createdAt: string;
  ipAddress: string | null;
  userAgent: string | null;
}

export default function DobRequestReview() {
  const [requests, setRequests] = useState<DobChangeRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<DobChangeRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/admin/dob-requests');
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (requestId: string) => {
    setProcessing(true);
    try {
      const response = await fetch(`/api/admin/dob-requests/${requestId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          notes: 'ID verified and approved',
          idVerified: true 
        })
      });
      
      if (response.ok) {
        await fetchRequests(); // Refresh the list
        setSelectedRequest(null);
        alert('✅ Request approved and user date of birth updated');
      } else {
        alert('❌ Failed to approve request');
      }
    } catch (error) {
      console.error('Approval error:', error);
      alert('❌ Error processing approval');
    } finally {
      setProcessing(false);
    }
  };

  const denyRequest = async (requestId: string, reason: string) => {
    setProcessing(true);
    try {
      const response = await fetch(`/api/admin/dob-requests/${requestId}/deny`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          notes: reason || 'ID verification failed',
          idVerified: false 
        })
      });
      
      if (response.ok) {
        await fetchRequests();
        setSelectedRequest(null);
        alert('❌ Request denied');
      } else {
        alert('Failed to deny request');
      }
    } catch (error) {
      console.error('Denial error:', error);
      alert('Error processing denial');
    } finally {
      setProcessing(false);
    }
  };

  const viewDocument = (documentUrl: string) => {
    if (documentUrl) {
      if (documentUrl.startsWith('data:')) {
        // For base64 data URLs, open directly
        window.open(documentUrl, '_blank');
      } else {
        // For file-based URLs, use the admin endpoint
        window.open(`/api/admin/secure-documents?url=${encodeURIComponent(documentUrl)}`, '_blank');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🔐 DOB Change Requests - ID Verification</h1>
      
      {requests.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No pending DOB change requests</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map((request) => (
            <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {request.user.username} (@{request.user.email})
                  </h3>
                  <p className="text-sm text-gray-500">
                    Request ID: {request.id}
                  </p>
                  <p className="text-sm text-gray-500">
                    Submitted: {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {request.status}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Date of Birth Information</h4>
                  <p><strong>Current DOB:</strong> {new Date(request.currentDOB).toLocaleDateString()}</p>
                  <p><strong>Requested DOB:</strong> {request.requestedDOB ? new Date(request.requestedDOB).toLocaleDateString() : 'Not specified'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">🔐 ID Verification</h4>
                  <p><strong>Document Type:</strong> {request.idDocumentType || 'Not provided'}</p>
                  <p><strong>ID Verified:</strong> {request.idVerified ? '✅ Yes' : '❌ Not yet'}</p>
                  {request.idDocumentHash && (
                    <p><strong>Document Hash:</strong> {request.idDocumentHash.substring(0, 16)}...</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Reason for Change</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{request.reason}</p>
              </div>

              {request.ipAddress && (
                <div className="mb-4 text-sm text-gray-600">
                  <p><strong>Security Info:</strong> IP: {request.ipAddress}</p>
                </div>
              )}

              {request.status === 'PENDING' && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  {request.idDocumentUrl && (
                    <button
                      onClick={() => viewDocument(request.idDocumentUrl!)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      🔍 View ID Document
                    </button>
                  )}
                  
                  <button
                    onClick={() => approveRequest(request.id)}
                    disabled={processing}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    ✅ Approve & Update DOB
                  </button>
                  
                  <button
                    onClick={() => {
                      const reason = prompt('Reason for denial:');
                      if (reason) denyRequest(request.id, reason);
                    }}
                    disabled={processing}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    ❌ Deny Request
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}