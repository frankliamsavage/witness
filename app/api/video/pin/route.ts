import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { videoId, isPinned } = await request.json();

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    // Verify the user owns this video
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: { user: true }
    });

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    if (video.user.clerkId !== userId) {
      return NextResponse.json({ error: 'Unauthorized - not your video' }, { status: 403 });
    }

    // If pinning, check if user already has 6 pinned videos
    if (isPinned) {
      const pinnedCount = await prisma.video.count({
        where: {
          userId: video.userId,
          isPinned: true
        }
      });

      if (pinnedCount >= 6) {
        return NextResponse.json({ error: 'Maximum 6 videos can be pinned' }, { status: 400 });
      }
    }

    // Update the video
    const updatedVideo = await prisma.video.update({
      where: { id: videoId },
      data: {
        isPinned,
        pinnedAt: isPinned ? new Date() : null
      }
    });

    return NextResponse.json({ 
      success: true, 
      video: updatedVideo 
    });

  } catch (error) {
    console.error('Pin video error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}