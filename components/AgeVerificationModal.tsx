'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface AgeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export default function AgeVerificationModal({ isOpen, onClose, onVerified }: AgeVerificationModalProps) {
  const { user } = useUser();
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Show success state
  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Age Verified Successfully!</h2>
            <p className="text-gray-600 mb-4">
              You have full access to all platform features.
            </p>
            <p className="text-sm text-indigo-600">
              Redirecting to your dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 0 || age > 120) {
        setError('Please enter a valid date of birth');
        setIsSubmitting(false);
        return;
      }

      const isMinor = age < 18;
      const requiresParentalConsent = age < 13;

      // Update user metadata
      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          dateOfBirth: dateOfBirth,
          ageVerified: true,
          isMinor,
          requiresParentalConsent,
          age
        }
      });

      // Call the API to update the database with initial verification completed
      const response = await fetch('/api/user/verify-age', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dateOfBirth: dateOfBirth,
          isMinor,
          requiresParentalConsent,
          hasCompletedInitialVerification: true // Mark that they completed the verification
        })
      });

      if (!response.ok) {
        throw new Error('Failed to verify age');
      }

      // Show success state
      setIsSuccess(true);
      
      // Call the onVerified callback
      onVerified();
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify age');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Age Verification Required</h2>
        <p className="text-gray-600 mb-6">
          This platform is for adults only. Please verify that you are 18 years or older to continue.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {error && (
            <div className="mb-4 text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isSubmitting || !dateOfBirth}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Verifying...' : 'Verify Age'}
            </button>
          </div>
        </form>
        
        <div className="mt-4 text-xs text-gray-500">
          <p>• Must be 18 years or older to create an account</p>
          <p>• Minors can contact us on Discord for support</p>
          <p>• Your information is kept private and secure</p>
        </div>
      </div>
    </div>
  );
}