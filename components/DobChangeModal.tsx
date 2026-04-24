'use client';

import { useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';

interface DobChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDOB: string;
}

export default function DobChangeModal({ isOpen, onClose, currentDOB }: DobChangeModalProps) {
  const { user } = useUser();
  const [reason, setReason] = useState('');
  const [requestedDOB, setRequestedDOB] = useState('');
  const [idDocumentType, setIdDocumentType] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a valid ID document (JPEG, PNG, or PDF)');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const uploadDocument = async (file: File): Promise<{ url: string; hash: string }> => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', 'id_verification');
    
    const response = await fetch('/api/upload/secure-document', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload document securely');
    }
    
    const { url, hash } = await response.json();
    return { url, hash };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setMessage('❌ Please upload a valid government-issued ID document to verify your date of birth change.');
      return;
    }
    
    if (!idDocumentType) {
      setMessage('❌ Please select your ID document type.');
      return;
    }
    
    setIsSubmitting(true);
    setMessage('🔐 Uploading and encrypting your ID document securely...');
    setUploadProgress(20);

    try {
      // Upload the secure document first
      setUploadProgress(50);
      setMessage('🔐 Verifying document integrity...');
      const { url: documentUrl, hash: documentHash } = await uploadDocument(selectedFile);
      setUploadProgress(80);
      
      setMessage('📋 Submitting your verification request...');
      const response = await fetch('/api/user/dob-change-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason,
          currentDOB,
          requestedDOB: requestedDOB || null,
          idDocumentUrl: documentUrl,
          idDocumentType,
          idDocumentHash: documentHash,
          userAgent: navigator.userAgent,
        }),
      });

      setUploadProgress(100);
      const data = await response.json();
      
      if (response.ok) {
        setIsSuccess(true);
        setMessage(data.message);
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          setReason('');
          setRequestedDOB('');
          setIdDocumentType('');
          setSelectedFile(null);
          setMessage('');
          setUploadProgress(0);
        }, 3000);
      } else {
        setMessage('❌ Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      setMessage('❌ An error occurred while processing your secure request. Please try again.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
          <p className="text-gray-600 mb-4">{message}</p>
          <p className="text-sm text-gray-500">You will be notified when your request is reviewed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Request Date of Birth Change</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Date of Birth
            </label>
            <input
              type="date"
              value={currentDOB}
              disabled
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-600"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correct Date of Birth (Optional)
            </label>
            <input
              type="date"
              value={requestedDOB}
              onChange={(e) => setRequestedDOB(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">Leave blank if you're unsure of the correct date</p>
          </div>

          {/* ID Document Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🆔 ID Document Type *
            </label>
            <select
              value={idDocumentType}
              onChange={(e) => setIdDocumentType(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select your ID type...</option>
              <option value="drivers_license">Driver's License</option>
              <option value="passport">Passport</option>
              <option value="state_id">State ID Card</option>
              <option value="military_id">Military ID</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">We need to verify your identity for security</p>
          </div>

          {/* ID Document Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔐 Upload Government-Issued ID *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
              {selectedFile ? (
                <div className="text-green-600">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Choose different file
                  </button>
                </div>
              ) : (
                <div>
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Choose ID document file
                  </button>
                  <p className="text-xs text-gray-500 mt-1">JPEG, PNG, PDF up to 10MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
              />
            </div>
            {uploadProgress > 0 && (
              <div className="mt-2">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Uploading... {uploadProgress}%</p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Change Request *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Please explain why you need to change your date of birth. Be specific about the circumstances..."
            />
          </div>

          {message && !isSuccess && (
            <div className={`mb-4 p-3 rounded-md text-sm ${
              message.includes('❌') ? 'bg-red-50 border border-red-200 text-red-700' : 
              'bg-blue-50 border border-blue-200 text-blue-700'
            }`}>
              {message}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reason.trim() || !selectedFile || !idDocumentType}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : '🔐 Submit Secure Request'}
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-xs text-amber-700">
            <strong>🔒 Security Notice:</strong> Your ID document will be encrypted and stored securely. 
            Only authorized administrators can access it for verification. The document will be deleted 
            after verification is complete.
          </p>
        </div>
      </div>
    </div>
  );
}