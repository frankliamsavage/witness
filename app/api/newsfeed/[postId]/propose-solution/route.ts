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

    const { solutionTitle, solutionDescription } = await request.json();

    if (!solutionTitle?.trim() || !solutionDescription?.trim()) {
      return NextResponse.json({ error: "Solution title and description are required" }, { status: 400 });
    }

    // Get user's database ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, username: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the original post exists and allows solutions
    const originalPost = await prisma.newsFeedPost.findUnique({
      where: { id: postId },
      select: { 
        id: true, 
        title: true,
        postType: true, 
        allowSolutions: true,
        authorId: true 
      }
    });

    if (!originalPost) {
      return NextResponse.json({ error: "Original post not found" }, { status: 404 });
    }

    if (!originalPost.allowSolutions) {
      return NextResponse.json({ error: "Solutions are not allowed for this issue" }, { status: 400 });
    }

    // Create a new poll post for the solution proposal
    const solutionPost = await prisma.newsFeedPost.create({
      data: {
        authorId: user.id,
        title: `Solution Proposal: ${solutionTitle}`,
        content: `Proposed solution for "${originalPost.title}"\n\n${solutionDescription}`,
        postType: 'POLL',
        feedType: 'RANDOM',
        pollOptions: ['Yes, this is a good solution', 'No, this needs improvement'],
        pollType: 'SOLUTION_PROPOSAL',
        tags: ['solution', 'proposal'],
        // Link to original issue
        linkUrl: `/dashboard/newsfeed?type=POLLS&highlight=${postId}`
      },
      include: {
        author: {
          select: {
            username: true,
            profilePicture: true,
            isVerified: true
          }
        }
      }
    });

    // Create a relationship between the original issue and the solution
    await prisma.issueSolution.create({
      data: {
        issuePostId: postId,
        solutionPostId: solutionPost.id,
        proposedBy: user.id
      }
    });

    return NextResponse.json({ 
      success: true, 
      solutionPost: {
        id: solutionPost.id,
        title: solutionPost.title,
        content: solutionPost.content,
        author: solutionPost.author,
        createdAt: solutionPost.createdAt,
        pollOptions: solutionPost.pollOptions
      }
    });
  } catch (error) {
    console.error('Error creating solution proposal:', error);
    return NextResponse.json({ error: "Failed to create solution proposal" }, { status: 500 });
  }
}