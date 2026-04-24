'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface ParentalConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsentRequested: () => void;
}

export default function ParentalConsentModal({ isOpen, onClose, onConsentRequested }: ParentalConsentModalProps) {
  const { user } = useUser();
  const [parentEmail, setParentEmail] = useState('');
  const [parentName, setParentName] = useState('');
  const [relationship, setRelationship] = useState('parent');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'sent' | 'waiting'>('form');

  if (!isOpen) return null;

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/user/request-parental-consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          parentEmail,
          parentName,
          relationship
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send consent request');
      }

      setStep('sent');
      onConsentRequested();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send consent request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = () => (
    <div>
      <div className="mb-4">
        <svg className="mx-auto h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Parental Consent Required</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>COPPA Protection:</strong> Users under 13 require verifiable parental consent before creating an account. 
          We'll send a consent form to your parent or guardian for approval.
        </p>
      </div>
      
      <form onSubmit={handleSubmitRequest}>
        <div className="mb-4">
          <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-2">
            Parent/Guardian Name *
          </label>
          <input
            type="text"
            id="parentName"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your parent or guardian's full name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-2">
            Relationship *
          </label>
          <select
            id="relationship"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="parent">Parent</option>
            <option value="guardian">Legal Guardian</option>
            <option value="grandparent">Grandparent</option>
            <option value="other">Other (with legal authority)</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Parent/Guardian Email Address *
          </label>
          <input
            type="email"
            id="parentEmail"
            value={parentEmail}
            onChange={(e) => setParentEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="parent@example.com"
          />
          <p className="mt-1 text-xs text-gray-500">
            We'll send a secure consent form to this email address
          </p>
        </div>
        
        {error && (
          <div className="mb-4 text-red-600 text-sm">
            {error}
          </div>
        )}
        
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !parentEmail || !parentName}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Request Consent'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderSent = () => (
    <div className="text-center">
      <div className="mb-4">
        <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Consent Request Sent!</h2>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-green-800 mb-2">
          We've sent a consent form to <strong>{parentEmail}</strong>
        </p>
        <p className="text-sm text-green-700">
          Your parent or guardian will receive an email with instructions to approve your account. 
          Once approved, you'll be able to access all age-appropriate features!
        </p>
      </div>
      
      <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-gray-900 mb-2">What happens next?</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Your parent will receive a secure consent form</li>
          <li>• They'll verify their identity and approve your account</li>
          <li>• You'll get an email when your account is activated</li>
          <li>• Special safety features will be enabled for your protection</li>
        </ul>
      </div>
      
      <button
        onClick={onClose}
        className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
      >
        OK, Got It
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {step === 'form' && renderForm()}
        {step === 'sent' && renderSent()}
      </div>
    </div>
  );
}