'use client';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ReportIssuePage() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    pollOptions: ['Yes, this needs to be fixed', 'No, this is not a priority'],
    pollType: 'ISSUE_REPORT' as const,
    pollDuration: '30',
    issueLocation: '',
    tags: '',
    // File upload fields
    uploadedImages: [] as File[],
    uploadedVideo: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.title || !formData.content || !formData.issueLocation) return;

    setLoading(true);
    try {
      let imageUrls: string[] = [];
      let videoUrl = '';

      // Upload files if any
      if (formData.uploadedImages.length > 0 || formData.uploadedVideo) {
        const uploadFormData = new FormData();
        
        formData.uploadedImages.forEach((file) => {
          uploadFormData.append(`images`, file);
        });
        
        if (formData.uploadedVideo) {
          uploadFormData.append('video', formData.uploadedVideo);
        }

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          imageUrls = uploadResult.imageUrls || [];
          videoUrl = uploadResult.videoUrl || '';
        }
      }

      const pollEndsAt = new Date(Date.now() + parseInt(formData.pollDuration) * 24 * 60 * 60 * 1000).toISOString();

      const response = await fetch('/api/newsfeed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          postType: 'POLL',
          imageUrls,
          videoUrl,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          pollOptions: formData.pollOptions.filter(option => option.trim()),
          pollType: formData.pollType,
          pollEndsAt,
          issueLocation: formData.issueLocation,
          allowSolutions: true,
          allowFunding: false
        })
      });

      if (response.ok) {
        router.push('/dashboard/newsfeed?type=POLLS');
      } else {
        console.error('Failed to create issue report');
      }
    } catch (error) {
      console.error('Error creating issue report:', error);
    }
    setLoading(false);
  };

  const addPollOption = () => {
    setFormData(prev => ({
      ...prev,
      pollOptions: [...prev.pollOptions, '']
    }));
  };

  const updatePollOption = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      pollOptions: prev.pollOptions.map((option, i) => i === index ? value : option)
    }));
  };

  const removePollOption = (index: number) => {
    if (formData.pollOptions.length <= 2) return; // Keep at least 2 options
    setFormData(prev => ({
      ...prev,
      pollOptions: prev.pollOptions.filter((_, i) => i !== index)
    }));
  };

  if (!user) {
    return <div>Please sign in to report issues.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-200 via-amber-100 via-emerald-100 via-sky-200 via-indigo-200 to-fuchsia-200">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-extrabold text-slate-900 flex items-center gap-3">
              <span>🚧</span>
              Report Community Issue
            </h1>
            <Link
              href="/engage"
              className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              ← Back to Engage
            </Link>
          </div>
          <p className="text-slate-600 mt-2">
            Report public issues with photos, location, and description for community solutions
          </p>
        </div>

        {/* Report Issue Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Issue Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Issue Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the issue in a few words..."
              />
            </div>

            {/* Issue Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Issue Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={6}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the issue in detail. What's the problem? How does it affect the community? When did it start?"
              />
            </div>

            {/* Issue Location */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Issue Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.issueLocation}
                onChange={(e) => setFormData(prev => ({ ...prev, issueLocation: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 123 Main Street, Independence, MO or Highway 40 near Oak Street"
              />
              <p className="text-xs text-slate-500 mt-1">Be specific so others can find and verify the issue</p>
            </div>

            {/* Upload Photos */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Upload Photos
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    setFormData(prev => ({
                      ...prev,
                      uploadedImages: Array.from(e.target.files!)
                    }));
                  }
                }}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-1">Upload photos to show the issue clearly</p>
              {formData.uploadedImages.length > 0 && (
                <div className="mt-2 text-sm text-green-600">
                  {formData.uploadedImages.length} image(s) selected
                </div>
              )}
            </div>

            {/* Upload Video */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Upload Video (Optional)
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFormData(prev => ({
                      ...prev,
                      uploadedVideo: e.target.files![0]
                    }));
                  }
                }}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-1">Video can help show the full context of the issue</p>
              {formData.uploadedVideo && (
                <div className="mt-2 text-sm text-green-600">
                  Video selected: {formData.uploadedVideo.name}
                </div>
              )}
            </div>

            {/* Poll Options */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">
                  Community Poll Options
                </label>
                <button
                  type="button"
                  onClick={addPollOption}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Option
                </button>
              </div>
              <p className="text-xs text-slate-500 mb-3">Give the community options to vote on this issue</p>
              {formData.pollOptions.map((option, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updatePollOption(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Option ${index + 1}`}
                  />
                  {formData.pollOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removePollOption(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tags (Optional)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="infrastructure, safety, maintenance"
              />
              <p className="text-xs text-slate-500 mt-1">Separate tags with commas</p>
            </div>

            {/* Issue Duration */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                How long should this issue remain open for solutions?
              </label>
              <select
                value={formData.pollDuration}
                onChange={(e) => setFormData(prev => ({ ...prev, pollDuration: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7">1 week</option>
                <option value="14">2 weeks</option>
                <option value="30">1 month</option>
                <option value="60">2 months</option>
                <option value="90">3 months</option>
              </select>
              <p className="text-xs text-slate-500 mt-1">Time for community and businesses to propose solutions</p>
            </div>

            {/* Process Explanation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 mb-2">📋 What happens next:</h4>
              <ol className="text-sm text-slate-600 space-y-1 list-decimal list-inside">
                <li>Your issue will be posted for the community to see and vote on</li>
                <li>Community members and businesses can propose solutions</li>
                <li>Everyone votes on the best solution approach</li>
                <li>Community can donate to fund the chosen solution</li>
                <li>Winning business/organization implements the fix</li>
              </ol>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                {loading ? 'Reporting Issue...' : '🚧 Report Issue'}
              </button>
              <Link
                href="/engage"
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}