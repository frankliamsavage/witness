import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // Try to find the post in the old Post table first
    const oldPost = await prisma.post.findUnique({
      where: { id },
      include: { user: true }
    });

    // If found in old table, verify ownership and delete
    if (oldPost) {
      if (oldPost.user.clerkId !== userId) {
        return NextResponse.json({ error: 'Unauthorized - not your post' }, { status: 403 });
      }

      await prisma.post.delete({
        where: { id }
      });

      return NextResponse.json({ 
        success: true,
        message: 'Post deleted successfully'
      });
    }

    // If not found in old table, try the new NewsFeedPost table
    const newPost = await prisma.newsFeedPost.findUnique({
      where: { id },
      include: { author: true }
    });

    if (!newPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (newPost.author.clerkId !== userId) {
      return NextResponse.json({ error: 'Unauthorized - not your post' }, { status: 403 });
    }

    // Delete the post from NewsFeedPost table
    await prisma.newsFeedPost.delete({
      where: { id }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}