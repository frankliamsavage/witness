'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function MusicDepartment() {
  const { user, isLoaded } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    description: '',
    genre: '',
    price: '0.99',
    file: null as File | null,
    coverImage: null as File | null,
  });

  if (isLoaded && !user) {
    redirect('/sign-in');
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files?.[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!formData.file) {
        throw new Error('Please select an audio file');
      }

      const submitFormData = new FormData();
      submitFormData.append('title', formData.title);
      submitFormData.append('artist', formData.artist);
      submitFormData.append('description', formData.description);
      submitFormData.append('genre', formData.genre);
      submitFormData.append('price', formData.price);
      submitFormData.append('file', formData.file);
      if (formData.coverImage) {
        submitFormData.append('coverImage', formData.coverImage);
      }

      const response = await fetch('/api/music/submit', {
        method: 'POST',
        body: submitFormData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit song');
      }

      setSubmitSuccess(true);
      setFormData({
        title: '',
        artist: '',
        description: '',
        genre: '',
        price: '0.99',
        file: null,
        coverImage: null,
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/music-hub" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to Music Hub
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">🎵 Submit Your Music</h1>
          <p className="text-slate-300 text-lg">Get reviewed by professionals and start earning from your art</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">

        {/* Submit Form */}
        <div className="bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-700">
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-900 border border-green-700 text-green-200 rounded-lg">
              ✓ Your song has been submitted successfully! An admin will review it shortly. Once approved, it will appear on your profile for fans to download!
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-900 border border-red-700 text-red-200 rounded-lg">
              ✕ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
                Song Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter song title"
                required
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            {/* Artist */}
            <div>
              <label htmlFor="artist" className="block text-sm font-medium text-slate-300 mb-2">
                Artist Name *
              </label>
              <input
                type="text"
                id="artist"
                name="artist"
                value={formData.artist}
                onChange={handleInputChange}
                placeholder="Enter artist name"
                required
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            {/* Genre */}
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-slate-300 mb-2">
                Genre *
              </label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition"
              >
                <option value="">Select a genre</option>
                <option value="rock">Rock</option>
                <option value="pop">Pop</option>
                <option value="hip-hop">Hip Hop</option>
                <option value="r&b">R&B</option>
                <option value="jazz">Jazz</option>
                <option value="classical">Classical</option>
                <option value="electronic">Electronic</option>
                <option value="country">Country</option>
                <option value="gospel">Gospel</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell us about your song, its inspiration, etc."
                rows={4}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition resize-none"
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-slate-300 mb-2">
                Download Price (USD) *
              </label>
              <div className="flex items-center gap-2">
                <span className="text-white">$</span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0.99"
                  max="99.99"
                  step="0.01"
                  required
                  className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition"
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">Fans will pay this to download. You earn 100% of sales!</p>
            </div>

            {/* Audio File */}
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-slate-300 mb-2">
                Audio File (MP3, WAV, FLAC) *
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleFileChange}
                  accept="audio/*"
                  required
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition"
                />
                {formData.file && (
                  <p className="mt-2 text-sm text-green-400">
                    ✓ {formData.file.name} ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-2">Max file size: 100 MB</p>
            </div>

            {/* Cover Image */}
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-slate-300 mb-2">
                Cover Image (Optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="coverImage"
                  name="coverImage"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition"
                />
                {formData.coverImage && (
                  <p className="mt-2 text-sm text-green-400">
                    ✓ {formData.coverImage.name}
                  </p>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-2">Recommended: 500x500px or larger</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Song for Review'}
            </button>
          </form>

          <p className="text-xs text-slate-400 mt-6 text-center">
            By submitting, you confirm this is your original work or you have permission to share it.
          </p>
        </div>
        </div>

        {/* Info Section */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-24">
            <h3 className="text-xl font-bold text-white mb-4">📋 What Happens Next?</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold text-blue-400 mb-1">✓ Step 1: Review</p>
                <p className="text-slate-300">Our team reviews your submission within 1-2 weeks.</p>
              </div>
              <div>
                <p className="font-semibold text-purple-400 mb-1">✓ Step 2: Live Stream</p>
                <p className="text-slate-300">If approved, your song may be featured in our live review stream.</p>
              </div>
              <div>
                <p className="font-semibold text-pink-400 mb-1">✓ Step 3: Earn</p>
                <p className="text-slate-300">Your music stays on your profile. Fans download and you earn 100%!</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-xs text-slate-400 mb-3 font-semibold">PRICING TIPS</p>
              <ul className="text-xs text-slate-400 space-y-2">
                <li>• $0.99 - Start affordable</li>
                <li>• $1.99 - Standard price</li>
                <li>• $2.99+ - Premium pricing</li>
              </ul>
            </div>

            <div className="mt-6">
              <Link
                href="/music-department/submissions"
                className="block text-center px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition text-sm font-medium"
              >
                View My Submissions
              </Link>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
