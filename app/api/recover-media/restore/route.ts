import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the database user by clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { url, caption } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Check if this file is already recovered
    const existingVideo = await prisma.video.findFirst({
      where: { 
        url: url,
        userId: user.id 
      }
    });

    if (existingVideo) {
      return NextResponse.json({ error: "File already recovered" }, { status: 400 });
    }

    // Create new video record
    const video = await prisma.video.create({
      data: {
        userId: user.id,
        url: url,
        caption: caption || null,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "File recovered successfully",
      video: {
        id: video.id,
        url: video.url,
        caption: video.caption
      }
    });

  } catch (error) {
    console.error('Recovery error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}