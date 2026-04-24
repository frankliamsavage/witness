import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    console.log('📁 Blob Upload API: FormData received:', {
      entries: Array.from(formData.entries()).map(([key, value]) => [key, value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value])
    });
    
    const imageUrls: string[] = [];
    let videoUrl = '';

    // Handle image uploads
    const images = formData.getAll('images') as File[];
    for (const image of images) {
      if (image.size > 0) {
        console.log('🖼️ Blob Upload API: Processing image file:', image.name);
        
        try {
          const blob = await put(image.name, image, {
            access: 'public',
            addRandomSuffix: true,
          });
          
          console.log('🖼️ Blob Upload API: Image uploaded successfully, URL:', blob.url);
          imageUrls.push(blob.url);
        } catch (blobError) {
          console.error('🖼️ Blob Upload API: Image blob upload failed:', blobError);
          return NextResponse.json({ 
            error: 'Image upload to blob storage failed: ' + (blobError instanceof Error ? blobError.message : 'Unknown error')
          }, { status: 500 });
        }
      }
    }

    // Handle video upload
    const video = formData.get('video') as File | null;
    console.log('🎥 Blob Upload API: Video file check:', {
      hasVideo: !!video,
      videoName: video?.name || 'No video',
      videoSize: video?.size || 0,
      videoType: video?.type || 'No type'
    });
    
    if (video && video.size > 0) {
      console.log('🎥 Blob Upload API: Processing video file:', video.name);
      
      try {
        const blob = await put(video.name, video, {
          access: 'public',
          addRandomSuffix: true,
        });
        
        videoUrl = blob.url;
        console.log('🎥 Blob Upload API: Video uploaded successfully, URL:', videoUrl);
      } catch (blobError) {
        console.error('🎥 Blob Upload API: Video blob upload failed:', blobError);
        return NextResponse.json({ 
          error: 'Video upload to blob storage failed: ' + (blobError instanceof Error ? blobError.message : 'Unknown error')
        }, { status: 500 });
      }
    }

    // Return URLs only - don't create database records here
    // The calling endpoint (/api/newsfeed) will handle database creation with proper content
    console.log('✅ Blob Upload API: Returning URLs:', {
      imageUrls: imageUrls.length,
      videoUrl: videoUrl || 'No video URL'
    });
    
    return NextResponse.json({ 
      success: true,
      imageUrls,
      videoUrl
    });

  } catch (error) {
    console.error('Blob upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload files: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}