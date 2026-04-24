import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public/uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch {
      // Directory might already exist, that's okay
    }

    const formData = await request.formData();
    console.log('📁 Upload API: FormData received:', {
      entries: Array.from(formData.entries()).map(([key, value]) => [key, value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value])
    });
    
    const imageUrls: string[] = [];
    let videoUrl = '';

    // Handle image uploads
    const images = formData.getAll('images') as File[];
    for (const image of images) {
      if (image.size > 0) {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Generate unique filename
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${image.name}`;
        const filepath = path.join(process.cwd(), 'public/uploads', filename);
        
        await writeFile(filepath, buffer);
        const url = `/uploads/${filename}`;
        imageUrls.push(url);
      }
    }

    // Handle video upload
    const video = formData.get('video') as File | null;
    console.log('🎥 Upload API: Video file check:', {
      hasVideo: !!video,
      videoName: video?.name || 'No video',
      videoSize: video?.size || 0,
      videoType: video?.type || 'No type'
    });
    
    if (video && video.size > 0) {
      console.log('🎥 Upload API: Processing video file:', video.name);
      const bytes = await video.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Generate unique filename
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${video.name}`;
      const filepath = path.join(process.cwd(), 'public/uploads', filename);
      
      console.log('🎥 Upload API: Writing video file to:', filepath);
      await writeFile(filepath, buffer);
      videoUrl = `/uploads/${filename}`;
      console.log('🎥 Upload API: Video uploaded successfully, URL:', videoUrl);
    }

    // Return URLs only - don't create database records here
    // The calling endpoint will handle database creation with proper content
    console.log('✅ Upload API: Returning URLs:', {
      imageUrls: imageUrls.length,
      videoUrl: videoUrl || 'No video URL'
    });
    
    return NextResponse.json({ 
      success: true,
      imageUrls,
      videoUrl
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload files: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}