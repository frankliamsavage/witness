import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await params;
    const { title, content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Get user's database ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the post exists and belongs to the user
    const existingPost = await prisma.newsFeedPost.findUnique({
      where: { id: postId },
      select: { authorId: true, postType: true }
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (existingPost.authorId !== user.id) {
      return NextResponse.json({ error: "You can only edit your own posts" }, { status: 403 });
    }

    // Don't allow editing of non-text posts for now (images, videos, etc.)
    if (existingPost.postType !== 'TEXT') {
      return NextResponse.json({ error: "Only text posts can be edited" }, { status: 400 });
    }

    // Update the post
    const updatedPost = await prisma.newsFeedPost.update({
      where: { id: postId },
      data: {
        title: title?.trim() || null,
        content: content.trim(),
        updatedAt: new Date()
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

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error('Error editing post:', error);
    return NextResponse.json({ error: "Failed to edit post" }, { status: 500 });
  }
}