'use client';

import { SignUp } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [showAgeVerification, setShowAgeVerification] = useState(true);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [userAge, setUserAge] = useState<number | null>(null);
  const router = useRouter();

  const calculateAge = (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleDateOfBirth = (dateOfBirth: string) => {
    const age = calculateAge(dateOfBirth);
    setUserAge(age);

    if (age < 18) {
      alert(`Sorry, you must be 18 or older to create an account on this platform. You are currently ${age} years old. You can return when you turn 18.`);
      window.location.href = "/";
      return;
    }

    setAgeConfirmed(true);
    setShowAgeVerification(false);
    
    // Store age info for the webhook
    sessionStorage.setItem('userAge', age.toString());
    sessionStorage.setItem('dateOfBirth', dateOfBirth);
  };

  if (showAgeVerification) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-pink-200 via-amber-100 via-emerald-100 via-sky-200 via-indigo-200 to-fuchsia-200 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          {/* COPPA Age Verification */}
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 0v5a4 4 0 11-8 0v-5m12 0a4 4 0 11-8 0m0 0v4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Age Verification</h1>
            <p className="text-sm text-gray-600 mb-6">
              Please enter your date of birth to continue with account creation
            </p>
          </div>

          {/* Date of Birth Input */}
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const dateOfBirth = formData.get('dateOfBirth') as string;
            if (dateOfBirth) {
              handleDateOfBirth(dateOfBirth);
            }
          }}>
            <div className="mb-6">
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                required
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Verify Age & Continue
            </button>
          </form>

          {/* Age Requirements */}
          <div className="mt-6 space-y-2 text-xs">
            <div className="bg-red-50 border border-red-200 rounded p-2">
              <span className="font-semibold text-red-800">Under 18:</span>
              <span className="text-red-700"> Cannot create accounts - must be 18+ to register</span>
            </div>
            <div className="bg-green-50 border border-green-200 rounded p-2">
              <span className="font-semibold text-green-800">18+:</span>
              <span className="text-green-700"> Can create accounts and access all platform features</span>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded p-2 text-blue-800 text-center">
              <strong>Minors:</strong> Contact us on Discord for special access to public areas
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            This platform is restricted to adults 18 years and older. Providing false age information may result in account termination and legal consequences.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-pink-200 via-amber-100 via-emerald-100 via-sky-200 via-indigo-200 to-fuchsia-200">
      <div className="w-full max-w-md">
        {/* Age Status Notice */}
        {ageConfirmed && userAge && (
          <div className={`${
            userAge < 18 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'
          } border rounded-lg p-4 mb-6 text-center`}>
            <p className={`${
              userAge < 18 ? 'text-yellow-800' : 'text-green-800'
            } text-sm font-medium`}>
              ✓ Age verified: {userAge} years old
            </p>
            <p className={`${
              userAge < 18 ? 'text-yellow-600' : 'text-green-600'
            } text-xs mt-1`}>
              {userAge < 18 
                ? 'You can view public content but cannot create a profile until age 18'
                : 'You have full access to create profiles and use all platform features'
              }
            </p>
          </div>
        )}

        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
              footerActionLink: 'text-blue-600 hover:text-blue-700'
            }
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          redirectUrl="/age-verification"
        />
      </div>
    </div>
  );
}