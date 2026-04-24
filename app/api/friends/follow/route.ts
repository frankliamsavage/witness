import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/friends/follow - Follow/Unfollow a user
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId: targetUserId, action } = await request.json();

    if (!targetUserId || !action || !['follow', 'unfollow'].includes(action)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get target user
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, username: true }
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    if (user.id === targetUser.id) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
    }

    if (action === 'follow') {
      // Check if already following
      const existingFollow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: user.id,
            followingId: targetUser.id
          }
        }
      });

      if (existingFollow) {
        return NextResponse.json({ error: "Already following this user" }, { status: 400 });
      }

      // Create follow relationship
      await prisma.follow.create({
        data: {
          followerId: user.id,
          followingId: targetUser.id
        }
      });

      return NextResponse.json({ 
        success: true, 
        message: `Now following ${targetUser.username}`,
        isFollowing: true
      });

    } else {
      // Unfollow
      const existingFollow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: user.id,
            followingId: targetUser.id
          }
        }
      });

      if (!existingFollow) {
        return NextResponse.json({ error: "Not following this user" }, { status: 400 });
      }

      // Remove follow relationship
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: user.id,
            followingId: targetUser.id
          }
        }
      });

      return NextResponse.json({ 
        success: true, 
        message: `Unfollowed ${targetUser.username}`,
        isFollowing: false
      });
    }

  } catch (error) {
    console.error('Error updating follow status:', error);
    return NextResponse.json({ error: "Failed to update follow status" }, { status: 500 });
  }
}