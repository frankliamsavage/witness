import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contentType, contentId } = await request.json();
    
    if (!contentType || !contentId) {
      return NextResponse.json({ error: "Missing contentType or contentId" }, { status: 400 });
    }

    console.log('🛡️ Admin moderation request:', { contentType, contentId, userId: userId.substring(0, 8) + '...' });

    // Check admin status
    const user = await prisma.$queryRaw`
      SELECT id, "clerkId", username, "isAdmin" 
      FROM "User" 
      WHERE "clerkId" = ${userId}
    `;

    const userArray = user as Array<{ id: string; clerkId: string; username: string | null; isAdmin: boolean }>;
    
    if (!userArray || userArray.length === 0) {
      console.error('❌ User not found for moderation request');
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentUser = userArray[0];
    
    if (!currentUser.isAdmin) {
      console.error('❌ Non-admin attempted moderation:', { userId: currentUser.id.substring(0, 8) + '...', username: currentUser.username });
      return NextResponse.json({ error: "Access denied. Administrator privileges required." }, { status: 403 });
    }

    console.log('✅ Admin verified for moderation:', { username: currentUser.username, contentType });

    let deletedContent;
    let message = '';

    switch (contentType.toLowerCase()) {
      case 'video':
        const video = await prisma.video.findUnique({
          where: { id: contentId },
          include: { user: { select: { username: true } } }
        });
        
        if (!video) {
          return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        await prisma.video.delete({ where: { id: contentId } });
        deletedContent = { type: 'video', uploader: video.user?.username, caption: video.caption };
        message = `Video by ${video.user?.username || 'Unknown'} deleted successfully`;
        break;

      case 'post':
        const post = await prisma.newsFeedPost.findUnique({
          where: { id: contentId },
          include: { author: { select: { username: true } } }
        });
        
        if (!post) {
          return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        await prisma.newsFeedPost.delete({ where: { id: contentId } });
        deletedContent = { type: 'post', author: post.author?.username, content: post.content.substring(0, 50) + '...' };
        message = `Post by ${post.author?.username || 'Unknown'} deleted successfully`;
        break;

      case 'testimony':
        const testimony = await prisma.testimony.findUnique({
          where: { id: contentId },
          select: { authorName: true, content: true }
        });
        
        if (!testimony) {
          return NextResponse.json({ error: "Testimony not found" }, { status: 404 });
        }

        await prisma.testimony.delete({ where: { id: contentId } });
        deletedContent = { type: 'testimony', author: testimony.authorName, content: testimony.content.substring(0, 50) + '...' };
        message = `Testimony by ${testimony.authorName} deleted successfully`;
        break;

      default:
        return NextResponse.json({ error: `Unsupported content type: ${contentType}` }, { status: 400 });
    }

    console.log('✅ Content moderated successfully:', { 
      contentType, 
      contentId: contentId.substring(0, 8) + '...',
      admin: currentUser.username,
      deletedContent 
    });

    return NextResponse.json({ 
      success: true, 
      message,
      moderatedBy: currentUser.username,
      deletedContent,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Admin moderation error:', error);
    return NextResponse.json({ 
      error: "Moderation action failed", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Get admin moderation logs (optional feature)
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin status
    const user = await prisma.$queryRaw`
      SELECT "isAdmin", username 
      FROM "User" 
      WHERE "clerkId" = ${userId}
    `;

    const userArray = user as Array<{ isAdmin: boolean; username: string | null }>;
    
    if (!userArray || userArray.length === 0 || !userArray[0].isAdmin) {
      return NextResponse.json({ error: "Access denied. Administrator privileges required." }, { status: 403 });
    }

    // Return summary of content that can be moderated
    const videoCount = await prisma.video.count();
    const postCount = await prisma.newsFeedPost.count();
    const testimonyCount = await prisma.testimony.count();
    
    // Get detailed post breakdown
    const textPostCount = await prisma.newsFeedPost.count({ where: { postType: 'TEXT' } });
    const imagePostCount = await prisma.newsFeedPost.count({ where: { postType: 'IMAGE' } });
    const videoPostCount = await prisma.newsFeedPost.count({ where: { postType: 'VIDEO' } });
    const linkPostCount = await prisma.newsFeedPost.count({ where: { postType: 'LINK' } });
    const pollPostCount = await prisma.newsFeedPost.count({ where: { postType: 'POLL' } });

    return NextResponse.json({
      success: true,
      adminUser: userArray[0].username,
      moderatableContent: {
        videos: videoCount,
        posts: postCount,
        testimonies: testimonyCount,
        total: videoCount + postCount + testimonyCount
      },
      detailedBreakdown: {
        textPosts: textPostCount,
        imagePosts: imagePostCount,
        videoPosts: videoPostCount,
        linkPosts: linkPostCount,
        pollPosts: pollPostCount,
        totalPosts: postCount,
        videos: videoCount,
        testimonies: testimonyCount
      },
      message: "Content moderation dashboard accessed successfully"
    });

  } catch (error) {
    console.error('❌ Admin dashboard error:', error);
    return NextResponse.json({ error: "Failed to load admin dashboard" }, { status: 500 });
  }
}