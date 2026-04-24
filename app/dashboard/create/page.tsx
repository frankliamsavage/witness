'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function CreatePostPage() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    postType: 'TEXT' as 'TEXT' | 'IMAGE' | 'VIDEO' | 'LINK',
    linkUrl: '',
    tags: '',
    // File upload fields
    uploadedImages: [] as File[],
    uploadedVideo: null as File | null
  });

  // Redirect to issue reporting if they try to create a poll here
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'poll') {
      router.push('/report-issue');
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validation: Check if required files are selected based on post type
    if (formData.postType === 'VIDEO' && !formData.uploadedVideo) {
      alert('Please select a video file to upload.');
      return;
    }

    if (formData.postType === 'IMAGE' && formData.uploadedImages.length === 0) {
      alert('Please select at least one image to upload.');
      return;
    }

    setLoading(true);
    try {
      let imageUrls: string[] = [];
      let videoUrl = '';

      // Upload files if any - using server-side blob upload API
      if (formData.uploadedImages.length > 0 || formData.uploadedVideo) {
        console.log('📤 Create Post: Starting server-side blob upload...', {
          imageCount: formData.uploadedImages.length,
          hasVideo: !!formData.uploadedVideo,
          videoName: formData.uploadedVideo?.name || 'No video',
          videoSize: formData.uploadedVideo?.size || 0
        });

        // Create FormData for server upload
        const uploadFormData = new FormData();
        
        // Add images
        formData.uploadedImages.forEach(image => {
          uploadFormData.append('images', image);
        });
        
        // Add video
        if (formData.uploadedVideo) {
          uploadFormData.append('video', formData.uploadedVideo);
        }

        try {
          console.log('📤 Create Post: Uploading to server blob storage...');
          const uploadResponse = await fetch('/api/blob-upload', {
            method: 'POST',
            body: uploadFormData,
          });

          if (!uploadResponse.ok) {
            throw new Error(`Upload failed: ${uploadResponse.status}`);
          }

          const uploadResult = await uploadResponse.json();
          console.log('📤 Create Post: Upload successful:', uploadResult);
          
          imageUrls = uploadResult.imageUrls || [];
          videoUrl = uploadResult.videoUrl || '';
          
        } catch (uploadError) {
          console.error('📤 Create Post: Upload failed:', uploadError);
          alert('File upload failed: ' + (uploadError instanceof Error ? uploadError.message : 'Unknown error'));
          setLoading(false);
          return;
        }
      }

      console.log('📤 Create Post: Sending to newsfeed API:', {
        title: formData.title,
        content: formData.content,
        postType: formData.postType,
        imageUrls,
        videoUrl,
        linkUrl: formData.linkUrl,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      });

      const response = await fetch('/api/newsfeed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          postType: formData.postType,
          imageUrls,
          videoUrl,
          linkUrl: formData.linkUrl,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        })
      });

      if (response.ok) {
        router.push('/dashboard/newsfeed');
      } else {
        console.error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
    setLoading(false);
  };

  if (!user) {
    return <div>Please sign in to create posts.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-200 via-amber-100 via-emerald-100 via-sky-200 via-indigo-200 to-fuchsia-200">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-extrabold text-slate-900 flex items-center gap-3">
              <span>✨</span>
              Create Post
            </h1>
            <Link
              href="/dashboard/newsfeed"
              className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              ← Back to Feed
            </Link>
          </div>
          <p className="text-slate-600 mt-2">
            Share your thoughts, images, videos, or links with the community
          </p>
          {/* Deployment trigger */}
        </div>

        {/* Create Post Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Post Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Post Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(['TEXT', 'IMAGE', 'VIDEO', 'LINK'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, postType: type }))}
                    className={`p-3 rounded-lg font-medium transition-all ${
                      formData.postType === type
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {type === 'TEXT' && '📝 Text'}
                    {type === 'IMAGE' && '🖼️ Image'}
                    {type === 'VIDEO' && '🎥 Video'}
                    {type === 'LINK' && '🔗 Link'}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Title (Optional)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Give your post a title..."
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={6}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What's on your mind?"
              />
            </div>

            {/* Image Upload */}
            {formData.postType === 'IMAGE' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Upload Images
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
                <p className="text-xs text-slate-500 mt-1">Upload one or more photos to share</p>
                {formData.uploadedImages.length > 0 && (
                  <div className="mt-2 text-sm text-green-600">
                    {formData.uploadedImages.length} image(s) selected
                  </div>
                )}
              </div>
            )}

            {/* Video Upload */}
            {formData.postType === 'VIDEO' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Upload Video
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
                <p className="text-xs text-slate-500 mt-1">Upload a video to share</p>
                {formData.uploadedVideo && (
                  <div className="mt-2 text-sm text-green-600">
                    Video selected: {formData.uploadedVideo.name}
                  </div>
                )}
              </div>
            )}

            {/* Link URL */}
            {formData.postType === 'LINK' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Link URL
                </label>
                <input
                  type="url"
                  value={formData.linkUrl || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
            )}

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
                placeholder="tag1, tag2, tag3"
              />
              <p className="text-xs text-slate-500 mt-1">Separate tags with commas</p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                {loading ? 'Creating...' : '✨ Create Post'}
              </button>
              <Link
                href="/dashboard/newsfeed"
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