'use client';

import { useState } from 'react';
import Link from 'next/link';

interface TeamApplication {
  teamName: string;
  captainUserId: string;
  memberList: string[];
  designConcept: string;
}

export default function TeamApplicationPage() {
  const [application, setApplication] = useState<TeamApplication>({
    teamName: '',
    captainUserId: '',
    memberList: [''],
    designConcept: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const addMember = () => {
    if (application.memberList.length < 4) {
      setApplication(prev => ({
        ...prev,
        memberList: [...prev.memberList, '']
      }));
    }
  };

  const removeMember = (index: number) => {
    if (application.memberList.length > 1) {
      setApplication(prev => ({
        ...prev,
        memberList: prev.memberList.filter((_, i) => i !== index)
      }));
    }
  };

  const updateMember = (index: number, value: string) => {
    setApplication(prev => ({
      ...prev,
      memberList: prev.memberList.map((member, i) => i === index ? value : member)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Mock delay
      
      // const response = await fetch('/api/admin/teams', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...application,
      //     competitionId: 'hub-build-2026',
      //     memberList: application.memberList.filter(m => m.trim())
      //   })
      // });
      
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h1>
          <p className="text-gray-600 mb-6">
            Your team application has been received. You'll be notified on Discord when it's reviewed.
          </p>
          <div className="space-y-3">
            <Link 
              href="/minecraft/competition/hub-build"
              className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition"
            >
              Back to Competition
            </Link>
            <Link 
              href="/discord"
              className="block w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl transition"
            >
              Join Discord
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Apply for Hub Build Competition</h1>
          <p className="text-gray-600 mb-6">
            Submit your team application to participate in the Season One Hub Build Competition
          </p>
          
          {/* Platform Requirements Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-3xl mx-auto">
            <h3 className="text-lg font-bold text-blue-900 mb-3">📝 Application Process</h3>
            <div className="text-sm text-blue-800 text-left space-y-2">
              <p><strong>Step 1:</strong> Submit this public application form (no account required)</p>
              <p><strong>Step 2:</strong> If selected, you'll be contacted to create accounts with age verification</p>
              <p><strong>Step 3:</strong> Must be 18+ to join server and participate in competitions</p>
              <p className="font-semibold text-blue-900 bg-blue-100 p-2 rounded mt-3">
                ⚠️ No personal data is collected until account creation step
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          
          {/* Team Name */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Team Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={50}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your team name"
              value={application.teamName}
              onChange={(e) => setApplication(prev => ({ ...prev, teamName: e.target.value }))}
            />
            <p className="text-xs text-gray-500 mt-1">Choose a memorable name for your team</p>
          </div>

          {/* Captain */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Team Captain <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Discord username (e.g. YourName#1234)"
              value={application.captainUserId}
              onChange={(e) => setApplication(prev => ({ ...prev, captainUserId: e.target.value }))}
            />
            <p className="text-xs text-gray-500 mt-1">Your Discord username - you'll be the main contact</p>
          </div>

          {/* Team Members */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Team Members <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {application.memberList.map((member, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    required={index === 0}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={index === 0 ? "Discord username (Captain)" : "Discord username (Optional)"}
                    value={member}
                    onChange={(e) => updateMember(index, e.target.value)}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="px-3 py-3 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {application.memberList.length < 4 && (
              <button
                type="button"
                onClick={addMember}
                className="mt-2 text-blue-500 hover:text-blue-600 text-sm font-medium"
              >
                + Add Team Member (Max 4 total)
              </button>
            )}
            
            <p className="text-xs text-gray-500 mt-1">
              Solo builders welcome! Teams can have 1-4 members maximum.
            </p>
          </div>

          {/* Design Concept */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Hub Design Concept <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Briefly describe your vision for the Season One hub. What makes your design unique?"
              value={application.designConcept}
              onChange={(e) => setApplication(prev => ({ ...prev, designConcept: e.target.value }))}
            />
            <p className="text-xs text-gray-500 mt-1">
              {application.designConcept.length}/500 characters
            </p>
          </div>

          {/* Terms Agreement */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-4">
              <input type="checkbox" required className="mt-1" />
              <label className="text-sm text-gray-700">
                I agree to the{' '}
                <Link href="/minecraft/competitions" className="text-blue-500 hover:underline">
                  competition rules
                </Link>{' '}
                and understand that submissions become property of Witness Project for server use.
              </label>
            </div>
            
            {/* Cash Prize Eligibility Acknowledgment */}
            <div className="flex items-start gap-3 pt-4 border-t border-gray-200">
              <input type="checkbox" required className="mt-1" />
              <label className="text-sm text-gray-700">
                <strong className="text-red-600">Cash Prize Eligibility:</strong>{' '}
                I understand that <strong>only teams with all adult members (18+)</strong> are eligible for cash prizes. 
                Teams with any minor members will receive recognition and cosmetic rewards only. 
                I acknowledge that I must be 18+ to receive cash compensation.
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white transform hover:scale-105'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting Application...
              </span>
            ) : (
              '🚀 Submit Team Application'
            )}
          </button>

          {/* Help Text */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              Questions? Join our{' '}
              <Link href="/discord" className="text-blue-500 hover:underline font-medium">
                Discord server
              </Link>{' '}
              and ask in #competitions
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}