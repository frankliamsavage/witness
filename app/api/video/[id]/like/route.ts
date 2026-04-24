import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id: videoId } = await params;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already liked
    const existingLike = await prisma.videoLike.findUnique({
      where: {
        videoId_userId: {
          videoId,
          userId: user.id,
        },
      },
    });

    let isLiked = false;
    
    if (existingLike) {
      // Unlike
      await prisma.videoLike.delete({
        where: { id: existingLike.id },
      });
      isLiked = false;
    } else {
      // Like
      await prisma.videoLike.create({
        data: {
          videoId,
          userId: user.id,
        },
      });
      isLiked = true;
    }

    // Get updated like count
    const likeCount = await prisma.videoLike.count({
      where: { videoId },
    });

    return NextResponse.json({
      likes: likeCount,
      isLiked,
    });
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json(
      { error: "Failed to process like" },
      { status: 500 }
    );
  }
}