import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { userId } = await auth();
    const { postId } = await params;
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { optionIndex } = await request.json();

    if (typeof optionIndex !== 'number') {
      return NextResponse.json({ error: "Valid option index is required" }, { status: 400 });
    }

    // Get user's database ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if poll exists and is still active
    const post = await prisma.newsFeedPost.findUnique({
      where: { id: postId },
      select: { 
        id: true, 
        postType: true, 
        pollOptions: true, 
        pollEndsAt: true 
      }
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.postType !== 'POLL') {
      return NextResponse.json({ error: "This is not a poll post" }, { status: 400 });
    }

    if (post.pollEndsAt && new Date(post.pollEndsAt) <= new Date()) {
      return NextResponse.json({ error: "This poll has ended" }, { status: 400 });
    }

    if (!post.pollOptions || optionIndex >= post.pollOptions.length) {
      return NextResponse.json({ error: "Invalid option index" }, { status: 400 });
    }

    // Check if user has already voted on this poll
    const existingVote = await prisma.pollVote.findUnique({
      where: {
        postId_userId: {
          postId: postId,
          userId: user.id
        }
      }
    });

    if (existingVote) {
      // Update existing vote
      await prisma.pollVote.update({
        where: {
          postId_userId: {
            postId: postId,
            userId: user.id
          }
        },
        data: { optionIndex }
      });
    } else {
      // Create new vote
      await prisma.pollVote.create({
        data: {
          userId: user.id,
          postId: postId,
          optionIndex
        }
      });
    }

    // Get updated vote counts for all options
    const voteCounts = await prisma.pollVote.groupBy({
      by: ['optionIndex'],
      where: { postId: postId },
      _count: { optionIndex: true }
    });

    // Convert to array format for easy access
    const voteResults = post.pollOptions.map((option, index) => {
      const count = voteCounts.find(vc => vc.optionIndex === index)?._count.optionIndex || 0;
      return {
        option,
        votes: count
      };
    });

    return NextResponse.json({ 
      success: true, 
      voteResults,
      userVote: optionIndex
    });
  } catch (error) {
    console.error('Error voting on poll:', error);
    return NextResponse.json({ error: "Failed to vote on poll" }, { status: 500 });
  }
}