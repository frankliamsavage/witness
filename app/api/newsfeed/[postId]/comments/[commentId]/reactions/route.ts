import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ postId: string; commentId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const { commentId } = params;
    const { reactionType } = await request.json();

    if (!reactionType || !['AGREE', 'DISAGREE'].includes(reactionType)) {
      return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 });
    }

    // Get user's database ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user already reacted to this comment
    const existingReaction = await prisma.commentReaction.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId: user.id
        }
      }
    });

    if (existingReaction) {
      if (existingReaction.reactionType === reactionType) {
        // Remove reaction if clicking the same button
        await prisma.commentReaction.delete({
          where: { id: existingReaction.id }
        });
      } else {
        // Update reaction if clicking different button
        await prisma.commentReaction.update({
          where: { id: existingReaction.id },
          data: { reactionType }
        });
      }
    } else {
      // Create new reaction
      await prisma.commentReaction.create({
        data: {
          commentId,
          userId: user.id,
          reactionType
        }
      });
    }

    // Get updated reaction counts
    const reactionCounts = await prisma.commentReaction.groupBy({
      by: ['reactionType'],
      where: { commentId },
      _count: true
    });

    const agreeCount = reactionCounts.find(r => r.reactionType === 'AGREE')?._count || 0;
    const disagreeCount = reactionCounts.find(r => r.reactionType === 'DISAGREE')?._count || 0;

    // Get current user's reaction
    const userReaction = await prisma.commentReaction.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId: user.id
        }
      }
    });

    return NextResponse.json({
      success: true,
      reactions: {
        agreeCount,
        disagreeCount,
        userReaction: userReaction?.reactionType || null
      }
    });

  } catch (error) {
    console.error('Error handling comment reaction:', error);
    return NextResponse.json({ error: 'Failed to handle reaction' }, { status: 500 });
  }
}