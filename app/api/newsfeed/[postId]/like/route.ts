import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

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

    // Get user's database ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already liked this post
    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: user.id
        }
      }
    });

    let likes: number;

    if (existingLike) {
      // Unlike the post
      await prisma.postLike.delete({
        where: {
          postId_userId: {
            postId,
            userId: user.id
          }
        }
      });

      // Decrement likes count
      const updatedPost = await prisma.newsFeedPost.update({
        where: { id: postId },
        data: { likes: { decrement: 1 } },
        select: { likes: true }
      });

      likes = updatedPost.likes;
    } else {
      // Like the post
      await prisma.postLike.create({
        data: {
          postId,
          userId: user.id
        }
      });

      // Increment likes count
      const updatedPost = await prisma.newsFeedPost.update({
        where: { id: postId },
        data: { likes: { increment: 1 } },
        select: { likes: true }
      });

      likes = updatedPost.likes;
    }

    return NextResponse.json({ success: true, likes, liked: !existingLike });
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}