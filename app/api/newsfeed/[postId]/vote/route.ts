import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { VoteType } from '@prisma/client';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await params;
    const { voteType } = await request.json() as { voteType: 'UPVOTE' | 'DOWNVOTE' };

    if (!voteType || !['UPVOTE', 'DOWNVOTE'].includes(voteType)) {
      return NextResponse.json({ error: "Invalid vote type" }, { status: 400 });
    }

    // Check if this is a legacy post (prefixed with 'legacy_')
    if (postId.startsWith('legacy_')) {
      return NextResponse.json({ 
        error: "Legacy posts don't support voting. Please create a new post to enable voting." 
      }, { status: 400 });
    }

    // Get user's database ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify the post exists
    const post = await prisma.newsFeedPost.findUnique({
      where: { id: postId },
      select: { id: true }
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user already voted on this post
    const existingVote = await prisma.postVote.findFirst({
      where: {
        postId,
        userId: user.id
      }
    });

    let upvotes: number;
    let downvotes: number;
    let userVote: string | null;

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // User is removing their vote (clicking same button)
        await prisma.postVote.delete({
          where: {
            id: existingVote.id
          }
        });

        // Decrement the appropriate count
        const updatedPost = await prisma.newsFeedPost.update({
          where: { id: postId },
          data: existingVote.voteType === 'UPVOTE' 
            ? { upvotes: { decrement: 1 } }
            : { downvotes: { decrement: 1 } },
          select: { upvotes: true, downvotes: true }
        });

        upvotes = updatedPost.upvotes;
        downvotes = updatedPost.downvotes;
        userVote = null;
      } else {
        // User is changing their vote
        await prisma.postVote.update({
          where: {
            id: existingVote.id
          },
          data: { voteType: voteType as VoteType }
        });

        // Update counts: remove old vote, add new vote
        const updatedPost = await prisma.newsFeedPost.update({
          where: { id: postId },
          data: existingVote.voteType === 'UPVOTE' 
            ? { upvotes: { decrement: 1 }, downvotes: { increment: 1 } }
            : { upvotes: { increment: 1 }, downvotes: { decrement: 1 } },
          select: { upvotes: true, downvotes: true }
        });

        upvotes = updatedPost.upvotes;
        downvotes = updatedPost.downvotes;
        userVote = voteType;
      }
    } else {
      // User is voting for the first time
      await prisma.postVote.create({
        data: {
          postId,
          userId: user.id,
          voteType: voteType as VoteType
        }
      });

      // Increment the appropriate count
      const updatedPost = await prisma.newsFeedPost.update({
        where: { id: postId },
        data: voteType === 'UPVOTE' 
          ? { upvotes: { increment: 1 } }
          : { downvotes: { increment: 1 } },
        select: { upvotes: true, downvotes: true }
      });

      upvotes = updatedPost.upvotes;
      downvotes = updatedPost.downvotes;
      userVote = voteType;
    }

    return NextResponse.json({ 
      success: true, 
      upvotes, 
      downvotes, 
      userVote 
    });
  } catch (error) {
    console.error('Error voting on post:', error);
    const errorDetails = error instanceof Error 
      ? { message: error.message, stack: error.stack, name: error.name }
      : { message: 'Unknown error', details: String(error) };
    console.error('Error details:', errorDetails);
    
    return NextResponse.json({ 
      error: "Failed to vote on post",
      details: errorDetails.message 
    }, { status: 500 });
  }
}