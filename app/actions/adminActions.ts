"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function deleteTestimonyAction(testimonyId: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { error: "You must be signed in to delete testimonies." };
    }

    console.log('🗑️ Admin delete attempt:', { testimonyId, userId: userId.substring(0, 8) + '...' });

    // Get user and check admin status using raw query to avoid TypeScript issues
    const user = await prisma.$queryRaw`
      SELECT id, "clerkId", username, "isAdmin" 
      FROM "User" 
      WHERE "clerkId" = ${userId}
    `;

    const userArray = user as Array<{ id: string; clerkId: string; username: string | null; isAdmin: boolean }>;
    
    if (!userArray || userArray.length === 0) {
      console.error('❌ User not found in database');
      return { error: "User account not found. Please refresh and try again." };
    }

    const currentUser = userArray[0];
    
    if (!currentUser.isAdmin) {
      console.error('❌ Non-admin user attempted deletion:', { userId: currentUser.id.substring(0, 8) + '...', username: currentUser.username });
      return { error: "Access denied. Only administrators can delete testimonies." };
    }

    console.log('✅ Admin verified:', { username: currentUser.username });

    // Check if testimony exists
    const testimony = await prisma.testimony.findUnique({
      where: { id: testimonyId },
      select: { 
        id: true, 
        content: true, 
        authorName: true,
        status: true
      }
    });

    if (!testimony) {
      console.error('❌ Testimony not found:', testimonyId);
      return { error: "Testimony not found." };
    }

    console.log('✅ Testimony found:', { 
      id: testimonyId.substring(0, 8) + '...', 
      author: testimony.authorName,
      status: testimony.status
    });

    // Delete the testimony (this will cascade delete all related votes)
    await prisma.testimony.delete({
      where: { id: testimonyId }
    });

    console.log('✅ Testimony deleted successfully');

    return { 
      success: true, 
      message: `Testimony by ${testimony.authorName} has been deleted successfully.`,
      deletedTestimony: {
        id: testimonyId.substring(0, 8) + '...',
        author: testimony.authorName,
        preview: testimony.content.substring(0, 50) + '...'
      }
    };

  } catch (err) {
    console.error("❌ Error deleting testimony:", err);
    
    if (err instanceof Error) {
      if (err.message.includes('Record to delete does not exist')) {
        return { error: "Testimony has already been deleted." };
      }
      console.error('❌ Detailed error:', err.message);
      return { error: `Delete failed: ${err.message}` };
    }
    
    return { error: "Failed to delete testimony. Please try again." };
  }
}

export async function deleteVideoAction(videoId: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { error: "You must be signed in to delete videos." };
    }

    console.log('🗑️ Admin video delete attempt:', { videoId, userId: userId.substring(0, 8) + '...' });

    // Get user and check admin status
    const user = await prisma.$queryRaw`
      SELECT id, "clerkId", username, "isAdmin" 
      FROM "User" 
      WHERE "clerkId" = ${userId}
    `;

    const userArray = user as Array<{ id: string; clerkId: string; username: string | null; isAdmin: boolean }>;
    
    if (!userArray || userArray.length === 0) {
      console.error('❌ User not found in database');
      return { error: "User account not found. Please refresh and try again." };
    }

    const currentUser = userArray[0];
    
    if (!currentUser.isAdmin) {
      console.error('❌ Non-admin user attempted video deletion:', { userId: currentUser.id.substring(0, 8) + '...', username: currentUser.username });
      return { error: "Access denied. Only administrators can delete videos." };
    }

    console.log('✅ Admin verified for video deletion:', { username: currentUser.username });

    // Check if video exists
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        user: {
          select: { username: true }
        }
      }
    });

    if (!video) {
      console.error('❌ Video not found:', videoId);
      return { error: "Video not found." };
    }

    console.log('✅ Video found:', { 
      id: videoId.substring(0, 8) + '...', 
      uploader: video.user?.username,
      caption: video.caption?.substring(0, 50) + '...' || 'No caption'
    });

    // Delete the video (this will cascade delete related likes/comments)
    await prisma.video.delete({
      where: { id: videoId }
    });

    console.log('✅ Video deleted successfully');

    return { 
      success: true, 
      message: `Video by ${video.user?.username || 'Unknown'} has been deleted successfully.`,
      deletedVideo: {
        id: videoId.substring(0, 8) + '...',
        uploader: video.user?.username || 'Unknown',
        caption: video.caption?.substring(0, 50) + '...' || 'No caption'
      }
    };

  } catch (err) {
    console.error("❌ Error deleting video:", err);
    
    if (err instanceof Error) {
      if (err.message.includes('Record to delete does not exist')) {
        return { error: "Video has already been deleted." };
      }
      console.error('❌ Detailed error:', err.message);
      return { error: `Delete failed: ${err.message}` };
    }
    
    return { error: "Failed to delete video. Please try again." };
  }
}

export async function deletePostAction(postId: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { error: "You must be signed in to delete posts." };
    }

    console.log('🗑️ Admin post delete attempt:', { postId, userId: userId.substring(0, 8) + '...' });

    // Get user and check admin status
    const user = await prisma.$queryRaw`
      SELECT id, "clerkId", username, "isAdmin" 
      FROM "User" 
      WHERE "clerkId" = ${userId}
    `;

    const userArray = user as Array<{ id: string; clerkId: string; username: string | null; isAdmin: boolean }>;
    
    if (!userArray || userArray.length === 0) {
      console.error('❌ User not found in database');
      return { error: "User account not found. Please refresh and try again." };
    }

    const currentUser = userArray[0];
    
    if (!currentUser.isAdmin) {
      console.error('❌ Non-admin user attempted post deletion:', { userId: currentUser.id.substring(0, 8) + '...', username: currentUser.username });
      return { error: "Access denied. Only administrators can delete posts." };
    }

    console.log('✅ Admin verified for post deletion:', { username: currentUser.username });

    // Check if post exists
    const post = await prisma.newsFeedPost.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: { username: true }
        }
      }
    });

    if (!post) {
      console.error('❌ Post not found:', postId);
      return { error: "Post not found." };
    }

    console.log('✅ Post found:', { 
      id: postId.substring(0, 8) + '...', 
      author: post.author?.username,
      content: post.content.substring(0, 50) + '...',
      type: post.postType
    });

    // Delete the post
    await prisma.newsFeedPost.delete({
      where: { id: postId }
    });

    console.log('✅ Post deleted successfully');

    return { 
      success: true, 
      message: `Post by ${post.author?.username || 'Unknown'} has been deleted successfully.`,
      deletedPost: {
        id: postId.substring(0, 8) + '...',
        author: post.author?.username || 'Unknown',
        preview: post.content.substring(0, 50) + '...',
        type: post.postType
      }
    };

  } catch (err) {
    console.error("❌ Error deleting post:", err);
    
    if (err instanceof Error) {
      if (err.message.includes('Record to delete does not exist')) {
        return { error: "Post has already been deleted." };
      }
      console.error('❌ Detailed error:', err.message);
      return { error: `Delete failed: ${err.message}` };
    }
    
    return { error: "Failed to delete post. Please try again." };
  }
}

export async function checkAdminStatus() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { isAdmin: false };
    }

    // Use raw query to avoid TypeScript issues
    const user = await prisma.$queryRaw`
      SELECT "isAdmin", username 
      FROM "User" 
      WHERE "clerkId" = ${userId}
    `;

    const userArray = user as Array<{ isAdmin: boolean; username: string | null }>;
    
    if (!userArray || userArray.length === 0) {
      return { isAdmin: false };
    }

    return { 
      isAdmin: userArray[0].isAdmin || false,
      username: userArray[0].username 
    };
  } catch (err) {
    console.error("Error checking admin status:", err);
    return { isAdmin: false };
  }
}