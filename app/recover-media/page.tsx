'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';

type MediaFile = {
  url: string;
  size: number;
  uploadedAt: string;
  pathname: string;
  type: 'image' | 'video';
};

export default function MediaRecoveryPage() {
  const { user } = useUser();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [recovering, setRecovering] = useState<string[]>([]);
  const [recovered, setRecovered] = useState<string[]>([]);

  useEffect(() => {
    loadMediaFiles();
  }, []);

  async function loadMediaFiles() {
    try {
      const response = await fetch('/api/recover-media');
      const data = await response.json();
      
      if (data.success) {
        const allFiles: MediaFile[] = [
          ...data.data.imageFiles.map((file: { url: string; size: number; uploadedAt: string; pathname: string }) => ({ ...file, type: 'image' as const })),
          ...data.data.videoFiles.map((file: { url: string; size: number; uploadedAt: string; pathname: string }) => ({ ...file, type: 'video' as const }))
        ];
        setMediaFiles(allFiles);
      }
    } catch (error) {
      console.error('Failed to load media files:', error);
    }
    setLoading(false);
  }

  async function recoverFile(file: MediaFile, caption: string = '') {
    if (!user || recovering.includes(file.url)) return;

    setRecovering(prev => [...prev, file.url]);
    
    try {
      // Create a new database record for this file
      const response = await fetch('/api/recover-media/restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: file.url,
          caption: caption || null
        }),
      });

      if (response.ok) {
        setRecovered(prev => [...prev, file.url]);
        alert('File recovered successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to recover file: ${error.error}`);
      }
    } catch (error) {
      console.error('Recovery error:', error);
      alert('Failed to recover file');
    }
    
    setRecovering(prev => prev.filter(url => url !== file.url));
  }

  if (!user) {
    return <div className="p-8">Please sign in to recover your media.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Media Recovery</h1>
          <p className="text-gray-600">
            Found {mediaFiles.length} files in storage. Click &ldquo;Recover&rdquo; on any files that belong to you.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600">Loading your files...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mediaFiles.map((file) => (
              <div key={file.url} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-square relative">
                  {file.type === 'image' ? (
                    <Image
                      src={file.url}
                      alt="Recoverable image"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <video
                      src={file.url}
                      className="w-full h-full object-cover"
                      poster=""
                    />
                  )}
                  {file.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full p-3">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  )}
                  {recovered.includes(file.url) && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                      ✓ Recovered
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="text-sm text-gray-500 mb-2">
                    <div>Type: {file.type}</div>
                    <div>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</div>
                    <div>Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}</div>
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Add caption (optional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-3"
                    id={`caption-${file.url}`}
                  />
                  
                  <button
                    onClick={() => {
                      const captionInput = document.getElementById(`caption-${file.url}`) as HTMLInputElement;
                      recoverFile(file, captionInput?.value || '');
                    }}
                    disabled={recovering.includes(file.url) || recovered.includes(file.url)}
                    className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      recovered.includes(file.url)
                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                        : recovering.includes(file.url)
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {recovered.includes(file.url) 
                      ? '✓ Recovered' 
                      : recovering.includes(file.url) 
                      ? 'Recovering...' 
                      : 'Recover This File'
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && mediaFiles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Files Found</h3>
            <p className="text-gray-600">
              No media files were found in storage. They may have been permanently deleted.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}