import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Post content is required' }, { status: 400 });
    }

    // Find the user by clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Require username to be set before posting
    if (!user.username || user.username.trim() === '') {
      return NextResponse.json({ 
        error: 'Please complete your profile setup by setting a username before posting.',
        redirectTo: '/dashboard/profile' 
      }, { status: 400 });
    }

    // Create the post
    const post = await prisma.post.create({
      data: {
        content: content.trim(),
        userId: user.id
      }
    });

    return NextResponse.json({ 
      success: true, 
      post 
    });

  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}