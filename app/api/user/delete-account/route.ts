import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

// Type declaration for global prisma
declare global {
  var prisma: PrismaClient | undefined;
}

// Use singleton pattern for Prisma client
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export async function DELETE() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(`🗑️ Starting account deletion process for user: ${userId}`);

    // Find the user first
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        authoredPosts: true,
        videos: true,
        testimonies: true,
        videoLikes: true,
        videoComments: true,
        postLikes: true,
        postVotes: true,
        postComments: true,
        sentMessages: true,
        receivedMessages: true,
        friendRequests: true,
        friendRequestsReceived: true,
        following: true,
        followers: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete all related data in the correct order to handle foreign key constraints
    
    // 1. Delete user interactions (likes, comments, votes)
    await prisma.videoLike.deleteMany({ where: { userId: user.id } });
    await prisma.videoComment.deleteMany({ where: { userId: user.id } });
    await prisma.postLike.deleteMany({ where: { userId: user.id } });
    await prisma.postVote.deleteMany({ where: { userId: user.id } });
    await prisma.postComment.deleteMany({ where: { userId: user.id } });
    await prisma.pollVote.deleteMany({ where: { userId: user.id } });
    await prisma.testimonyVote.deleteMany({ where: { userId: user.id } });
    
    console.log(`✅ Deleted user interactions for user: ${userId}`);

    // 2. Delete friendships and follows
    await prisma.friendship.deleteMany({ 
      where: { 
        OR: [
          { requesterId: user.id },
          { addresseeId: user.id }
        ]
      }
    });
    await prisma.follow.deleteMany({ 
      where: { 
        OR: [
          { followerId: user.id },
          { followingId: user.id }
        ]
      }
    });
    
    console.log(`✅ Deleted friendships and follows for user: ${userId}`);

    // 3. Delete messages
    await prisma.message.deleteMany({ 
      where: { 
        OR: [
          { senderId: user.id },
          { receiverId: user.id }
        ]
      }
    });
    
    console.log(`✅ Deleted messages for user: ${userId}`);

    // 4. Delete user's content (posts, videos, testimonies)
    // First delete related data for posts
    for (const post of user.authoredPosts) {
      await prisma.postLike.deleteMany({ where: { postId: post.id } });
      await prisma.postVote.deleteMany({ where: { postId: post.id } });
      await prisma.postComment.deleteMany({ where: { postId: post.id } });
      if (post.postType === 'POLL') {
        await prisma.pollVote.deleteMany({ where: { postId: post.id } });
      }
    }
    await prisma.newsFeedPost.deleteMany({ where: { authorId: user.id } });
    
    console.log(`✅ Deleted posts for user: ${userId}`);

    // Delete videos and related data
    for (const video of user.videos) {
      await prisma.videoLike.deleteMany({ where: { videoId: video.id } });
      await prisma.videoComment.deleteMany({ where: { videoId: video.id } });
    }
    await prisma.video.deleteMany({ where: { userId: user.id } });
    
    console.log(`✅ Deleted videos for user: ${userId}`);

    // Delete testimonies and votes
    for (const testimony of user.testimonies) {
      await prisma.testimonyVote.deleteMany({ where: { testimonyId: testimony.id } });
    }
    await prisma.testimony.deleteMany({ where: { userId: user.id } });
    
    console.log(`✅ Deleted testimonies for user: ${userId}`);

    // 5. Delete questions
    await prisma.question.deleteMany({ where: { userId: user.id } });
    
    console.log(`✅ Deleted questions for user: ${userId}`);

    // 6. Finally, delete the user record
    await prisma.user.delete({ where: { id: user.id } });
    
    console.log(`✅ Account deletion completed for user: ${userId}`);

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
      deletedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Failed to delete account:', error);
    
    return NextResponse.json({
      error: 'Failed to delete account',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}