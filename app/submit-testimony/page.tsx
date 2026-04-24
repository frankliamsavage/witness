'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function SubmitTestimonyPage() {
  const { user, isLoaded } = useUser();
  const [userType, setUserType] = useState<'registered' | 'guest'>(user ? 'registered' : 'guest');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Update user type when user changes
  useEffect(() => {
    setUserType(user ? 'registered' : 'guest');
  }, [user]);

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-gradient-to-tr from-indigo-200 via-amber-100 via-pink-200 to-fuchsia-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-xl text-slate-900">Loading testimony form...</p>
        </div>
      </main>
    );
  }

  async function handleTestimonySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    formData.set("userType", userType);
    
    // Set the correct author name based on user type
    if (userType === 'registered' && user) {
      formData.set('authorName', user?.username || 'Anonymous');
    } else {
      // For guest submissions or when user chooses anonymous
      formData.set('authorName', 'Anonymous');
    }

    try {
      console.log("🚀 Starting testimony submission...");
      
      // Use direct API route
      const response = await fetch('/api/testimony', {
        method: 'POST',
        body: formData
      });
      
      console.log("API response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const result = await response.json();
      console.log("API result:", result);
      
      if (result.error) {
        setMessage(`❌ ${result.error}`);
      } else if (result.success) {
        console.log("✅ Submission succeeded!");
        setMessage(`✅ ${result.message}`);
        setSubmitted(true);
        if (e.currentTarget) {
          e.currentTarget.reset();
        }
      } else {
        console.log("❓ Unexpected result:", result);
        setMessage(`❌ Unexpected error occurred. Please try again.`);
      }
    } catch (error) {
      console.error("❌ Submission failed:", error);
      setMessage(`❌ Submission failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or contact support.`);
    }
    
    setLoading(false);
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-tr from-green-200 via-blue-100 to-purple-200 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center pt-12">
            <div className="inline-block p-6 rounded-full bg-white/70 mb-8">
              <div className="text-8xl">🎉</div>
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-6">Thank You!</h1>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 mb-10">
              <div className="text-2xl mb-6">💝</div>
              <p className="text-xl text-slate-700 mb-8 leading-relaxed">{message.replace('✅ ', '')}</p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <Link 
                  href="/book-of-life"
                  className="flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <span className="text-xl">📖</span>
                  Read Community Stories
                </Link>
                
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage("");
                  }}
                  className="flex items-center justify-center gap-3 bg-slate-100 text-slate-700 px-8 py-4 rounded-xl font-semibold hover:bg-slate-200 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <span className="text-xl">✍️</span>
                  Share Another Story
                </button>
              </div>

              <div className="text-center space-y-4">
                <div className="flex justify-center gap-6 text-sm text-slate-600">
                  <Link href="/witness" className="hover:text-slate-900 underline">🧿 Witness</Link>
                  <Link href="/support" className="hover:text-slate-900 underline">💝 Support</Link>
                  <Link href="/dashboard" className="hover:text-slate-900 underline">📊 Dashboard</Link>
                </div>
                
                <Link 
                  href="/"
                  className="inline-block text-slate-600 hover:text-slate-900 font-medium underline py-2"
                >
                  ← Back Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-tr from-indigo-200 via-amber-100 via-pink-200 to-fuchsia-200 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-block p-4 rounded-full bg-white/50 mb-6">
            <div className="text-5xl">✍️</div>
          </div>
          <h1 className="text-5xl font-extrabold text-slate-900 mb-4">Share Your Testimony</h1>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed mb-6">
            Your voice matters. Share your experience, testimony, or witness account with our community.
            Your story has the power to inspire, encourage, and connect with others.
          </p>
          <Link 
            href="/book-of-life"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium underline"
          >
            <span>📖</span>
            Read other testimonies first
          </Link>
        </div>

        {/* Submission Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="max-w-2xl mx-auto">
            {/* Message Display */}
            {message && !submitted && (
              <div className={`mb-6 p-4 rounded-lg border ${
                message.startsWith('❌') 
                  ? 'bg-red-50 border-red-200 text-red-800' 
                  : 'bg-green-50 border-green-200 text-green-800'
              }`}>
                <div className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">
                    {message.startsWith('❌') ? '⚠️' : '✅'}
                  </span>
                  <div>
                    <p className="font-medium">{message.replace(/^[❌✅]\s*/, '')}</p>
                    {message.startsWith('❌') && (
                      <p className="text-sm mt-2 opacity-75">
                        If this continues, please try refreshing the page or contact support.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleTestimonySubmit} className="space-y-6">
              {/* User Type Selection */}
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-medium text-slate-700 mb-3">I am submitting as:</p>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="userTypeSelection"
                      value="registered"
                      checked={userType === 'registered'}
                      onChange={() => setUserType('registered')}
                      disabled={!user}
                      className="mr-2"
                    />
                    <span className={`text-sm ${!user ? 'text-slate-400' : ''}`}>
                      Registered User {!user && '(Sign in required)'}
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="userTypeSelection"
                      value="guest"
                      checked={userType === 'guest'}
                      onChange={() => setUserType('guest')}
                      className="mr-2"
                    />
                    <span className="text-sm">Anonymous (no account needed)</span>
                  </label>
                </div>
                {!user && (
                  <p className="text-xs text-slate-500 mt-2">
                    <Link href="/sign-in" className="text-blue-600 hover:text-blue-800 underline">
                      Sign in
                    </Link> to submit as a registered user for immediate publication.
                  </p>
                )}
              </div>

              {/* Name Field */}
              <div>
                <label htmlFor="authorName" className="block text-sm font-medium text-slate-700 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  id="authorName"
                  name="authorName"
                  value={userType === 'registered' && user ? (user?.username || 'Anonymous') : 'Anonymous Guest'}
                  readOnly
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-100 text-slate-700 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {userType === 'registered' 
                    ? 'Your testimony will be posted with your username' 
                    : 'Your testimony will be posted anonymously'
                  }
                </p>
              </div>

              {/* Testimony Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-2">
                  Your Testimony *
                </label>
                <textarea
                  id="content"
                  name="content"
                  placeholder="Share your story, experience, or testimony... What would you like the community to know? What experience changed your perspective? What wisdom would you share?"
                  rows={10}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-vertical"
                ></textarea>
                <p className="text-xs text-slate-500 mt-1">
                  Be authentic and heartfelt. Your genuine experience matters most.
                </p>
              </div>

              {/* Contact Email */}
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-700 mb-2">
                  Contact Email (optional)
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">
                  We may contact you for clarification or updates on your submission.
                </p>
              </div>

              {/* Guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-blue-600 mr-3 mt-0.5">💡</div>
                  <div>
                    <p className="text-sm text-blue-800 font-medium mb-2">Submission Guidelines</p>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Be respectful and considerate of others</li>
                      <li>• Share your authentic experience</li>
                      <li>• Avoid hate speech or discriminatory content</li>
                      <li>• Keep personal information private unless you choose to share</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Moderation Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-amber-600 mr-3 mt-0.5">⚠️</div>
                  <div>
                    <p className="text-sm text-amber-800 font-medium">Publication Process</p>
                    <p className="text-xs text-amber-700 mt-1">
                      {userType === 'guest' 
                        ? 'Guest testimonies will be reviewed by our moderation team before being published to ensure they meet our community guidelines.'
                        : 'Registered user testimonies are published immediately but may be moderated if they violate community guidelines.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white px-6 py-4 rounded-xl font-semibold hover:bg-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting Your Story...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-xl">📝</span>
                    <span>Submit Your Testimony</span>
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/book-of-life"
              className="inline-flex items-center gap-2 bg-white/70 text-slate-700 px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition backdrop-blur-sm"
            >
              <span>📖</span>
              Read Community Stories
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white/70 text-slate-700 px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition backdrop-blur-sm"
            >
              <span>🏠</span>
              Back Home
            </Link>
          </div>
          
          <p className="text-slate-600 text-sm mt-6">
            Need help? <Link href="/support" className="underline hover:text-slate-900">Contact support</Link>
          </p>
        </div>
      </div>
    </main>
  );
}