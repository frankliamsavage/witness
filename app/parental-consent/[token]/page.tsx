'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface ConsentData {
  id: string;
  parentEmail: string;
  parentName: string;
  relationship: string;
  user: {
    username?: string;
    age?: number;
  };
  expiresAt: string;
  status: string;
}

export default function ParentalConsentPage() {
  const params = useParams();
  const token = params.token as string;
  const [consentData, setConsentData] = useState<ConsentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [decision, setDecision] = useState<'approve' | 'deny' | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (token) {
      fetchConsentData();
    }
  }, [token]);

  const fetchConsentData = async () => {
    try {
      const response = await fetch(`/api/parental-consent/${token}`);
      if (!response.ok) {
        throw new Error('Invalid or expired consent link');
      }
      const data = await response.json();
      setConsentData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load consent request');
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (approve: boolean) => {
    setSubmitting(true);
    setDecision(approve ? 'approve' : 'deny');

    try {
      const response = await fetch(`/api/parental-consent/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          decision: approve ? 'APPROVED' : 'DENIED'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process consent decision');
      }

      setCompleted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process decision');
      setDecision(null);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading consent request...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center">
        <div className="max-w-md mx-4 bg-white rounded-lg shadow-lg p-6 text-center">
          <svg className="mx-auto h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="max-w-md mx-4 bg-white rounded-lg shadow-lg p-6 text-center">
          <svg className="mx-auto h-16 w-16 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {decision === 'approve' ? 'Consent Approved' : 'Consent Denied'}
          </h1>
          <p className="text-gray-600 mb-4">
            {decision === 'approve' 
              ? "Your child's account has been approved and they can now access age-appropriate features on the platform."
              : "Your child's account request has been denied. They will not be able to create an account at this time."
            }
          </p>
          <a 
            href="https://witnessproject.net" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Visit Witness Project
          </a>
        </div>
      </div>
    );
  }

  if (!consentData) {
    return null;
  }

  const isExpired = new Date(consentData.expiresAt) < new Date();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="max-w-2xl mx-4 sm:mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Parental Consent Required</h1>
          <p className="text-blue-100">Witness Project Account Approval</p>
        </div>

        <div className="p-6">
          {isExpired ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="text-red-800 font-medium mb-1">Consent Request Expired</h3>
              <p className="text-red-700 text-sm">
                This consent request expired on {new Date(consentData.expiresAt).toLocaleDateString()}. 
                Please contact support if you need a new request.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-blue-800 font-medium mb-1">COPPA Compliance Notice</h3>
                <p className="text-blue-700 text-sm">
                  Federal law requires parental consent for children under 13 to use online services. 
                  Your verification helps us protect your child's privacy and safety.
                </p>
              </div>

              {/* Consent Details */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Account Request Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Child's Username</label>
                      <p className="text-gray-900">{consentData.user.username || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Estimated Age</label>
                      <p className="text-gray-900">{consentData.user.age || 'Under 13'} years old</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Request Date</label>
                      <p className="text-gray-900">{new Date(consentData.expiresAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Parent/Guardian Info</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Name</label>
                      <p className="text-gray-900">{consentData.parentName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-900">{consentData.parentEmail}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Relationship</label>
                      <p className="text-gray-900 capitalize">{consentData.relationship}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Safety Features */}
              <div className="bg-gray-50 rounded-lg p-4 mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">Child Safety Features</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Enhanced content filtering and age-appropriate restrictions
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Limited communication features with safety monitoring
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    No direct messaging with adult users
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Parental oversight and control options
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Automatic account transition to adult status at age 18
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    No collection of personal information beyond what's necessary
                  </li>
                </ul>
              </div>

              {/* Decision Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => handleDecision(true)}
                  disabled={submitting}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 disabled:opacity-50 font-medium"
                >
                  {submitting && decision === 'approve' ? 'Approving...' : 'Approve Account'}
                </button>
                <button
                  onClick={() => handleDecision(false)}
                  disabled={submitting}
                  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 disabled:opacity-50 font-medium"
                >
                  {submitting && decision === 'deny' ? 'Denying...' : 'Deny Account'}
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center">
                By clicking "Approve Account", you give consent for your child to use the Witness Project platform 
                under the safety features and restrictions described above.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}