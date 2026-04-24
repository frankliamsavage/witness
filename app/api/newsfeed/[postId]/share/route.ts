import { NextRequest, NextResponse } from 'next/server';
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

    // Check if this is a legacy post (prefixed with 'legacy_')
    if (postId.startsWith('legacy_')) {
      // For legacy posts, we can't increment share count, but we can still allow sharing
      const legacyPostId = postId.replace('legacy_', '');
      return NextResponse.json({
        success: true,
        shares: 0, // Legacy posts don't track shares
        shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://witnessproject.net'}/legacy-post/${legacyPostId}`,
        title: "Check out this post from Witness",
        text: "Interesting post shared from the Witness community"
      });
    }

    // Get user's database ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if post exists
    const post = await prisma.newsFeedPost.findUnique({
      where: { id: postId },
      select: { id: true, shares: true, title: true, content: true }
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Increment share count
    const updatedPost = await prisma.newsFeedPost.update({
      where: { id: postId },
      data: { shares: { increment: 1 } },
      select: { shares: true }
    });

    return NextResponse.json({ 
      success: true, 
      shares: updatedPost.shares,
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://witnessproject.net'}/post/${postId}`,
      title: post.title || 'Check out this post',
      description: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : '')
    });
  } catch (error) {
    console.error('Error sharing post:', error);
    return NextResponse.json({ error: "Failed to share post" }, { status: 500 });
  }
}