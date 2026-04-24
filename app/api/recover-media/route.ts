import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET() {
  try {
    console.log('Checking Vercel Blob for existing files...');
    
    // List all blobs to see what files still exist
    const { blobs } = await list();
    
    console.log(`Found ${blobs.length} files in blob storage`);
    
    // Separate images and videos
    const images = blobs.filter(blob => {
      const url = blob.url.toLowerCase();
      return url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || 
             url.includes('.gif') || url.includes('.webp');
    });
    
    const videos = blobs.filter(blob => {
      const url = blob.url.toLowerCase();
      return url.includes('.mp4') || url.includes('.mov') || url.includes('.avi') || 
             url.includes('.webm');
    });
    
    return NextResponse.json({
      success: true,
      data: {
        totalFiles: blobs.length,
        images: images.length,
        videos: videos.length,
        allFiles: blobs.map(blob => ({
          url: blob.url,
          size: blob.size,
          uploadedAt: blob.uploadedAt,
          pathname: blob.pathname
        })).sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()),
        imageFiles: images.map(blob => ({
          url: blob.url,
          size: blob.size,
          uploadedAt: blob.uploadedAt,
          pathname: blob.pathname
        })).sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()),
        videoFiles: videos.map(blob => ({
          url: blob.url,
          size: blob.size,
          uploadedAt: blob.uploadedAt,
          pathname: blob.pathname
        })).sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      }
    });
    
  } catch (error) {
    console.error('Blob recovery error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Could not access blob storage'
    }, { status: 500 });
  }
}