import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const { postId } = params;

    console.log('Loading comments for post:', postId);

    const comments = await prisma.postComment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
            isVerified: true,
            clerkId: true
          }
        },
        reactions: {
          select: {
            id: true,
            reactionType: true,
            userId: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    console.log('Found comments:', comments.length);

    // Get current user info for delete permissions
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, isAdmin: true, clerkId: true }
    });

    // Add reaction counts and user's reaction to each comment
    const commentsWithReactions = comments.map(comment => {
      const reactions = comment.reactions || [];
      const agreeCount = reactions.filter(r => r.reactionType === 'AGREE').length;
      const disagreeCount = reactions.filter(r => r.reactionType === 'DISAGREE').length;
      const userReaction = reactions.find(r => r.userId === currentUser?.id)?.reactionType || null;
      
      return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: comment.user,
        reactionCounts: {
          agreeCount,
          disagreeCount
        },
        userReaction
      };
    });

    return NextResponse.json({ 
      success: true, 
      comments: commentsWithReactions,
      currentUser: {
        id: currentUser?.id,
        userId: currentUser?.clerkId,
        isAdmin: currentUser?.isAdmin || false
      }
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const { postId } = params;
    
    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }
    
    const body = await request.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
    }

    if (content.trim().length > 500) {
      return NextResponse.json({ error: "Comment is too long (max 500 characters)" }, { status: 400 });
    }

    // Get user's database ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify post exists
    const post = await prisma.newsFeedPost.findUnique({
      where: { id: postId },
      select: { id: true }
    });
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Create the comment
    const comment = await prisma.postComment.create({
      data: {
        postId,
        userId: user.id,
        content: content.trim()
      },
      include: {
        user: {
          select: {
            username: true,
            profilePicture: true,
            isVerified: true
          }
        }
      }
    });

    // Increment comment count on the post
    await prisma.newsFeedPost.update({
      where: { id: postId },
      data: { comments: { increment: 1 } }
    });

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ 
      error: "Failed to create comment"
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const { postId } = params;
    const { commentId } = await request.json();
    
    if (!commentId) {
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, isAdmin: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the comment to check ownership
    const comment = await prisma.postComment.findUnique({
      where: { id: commentId },
      select: { userId: true, postId: true }
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Verify the comment belongs to the specified post
    if (comment.postId !== postId) {
      return NextResponse.json({ error: "Comment does not belong to this post" }, { status: 400 });
    }

    // Check if user can delete this comment (author or admin)
    const canDelete = comment.userId === currentUser.id || currentUser.isAdmin;
    
    if (!canDelete) {
      return NextResponse.json({ error: "Not authorized to delete this comment" }, { status: 403 });
    }

    // Delete the comment
    await prisma.postComment.delete({
      where: { id: commentId }
    });

    // Decrement comment count on the post
    await prisma.newsFeedPost.update({
      where: { id: postId },
      data: { comments: { decrement: 1 } }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ 
      error: "Failed to delete comment"
    }, { status: 500 });
  }
}