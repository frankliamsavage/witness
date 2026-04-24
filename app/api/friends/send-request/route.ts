import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/friends/send-request - Send friend request by user ID
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { friendId } = await request.json();

    if (!friendId) {
      return NextResponse.json({ error: "Friend ID is required" }, { status: 400 });
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
      where: { id: friendId },
      select: { id: true, username: true }
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    if (user.id === targetUser.id) {
      return NextResponse.json({ error: "Cannot send friend request to yourself" }, { status: 400 });
    }

    // Check if friendship already exists
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: user.id, addresseeId: targetUser.id },
          { requesterId: targetUser.id, addresseeId: user.id }
        ]
      }
    });

    if (existingFriendship) {
      if (existingFriendship.status === 'ACCEPTED') {
        return NextResponse.json({ error: "Already friends" }, { status: 400 });
      } else if (existingFriendship.status === 'PENDING') {
        return NextResponse.json({ error: "Friend request already sent" }, { status: 400 });
      }
    }

    // Create friend request
    const friendship = await prisma.friendship.create({
      data: {
        requesterId: user.id,
        addresseeId: targetUser.id,
        status: 'PENDING'
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Friend request sent to ${targetUser.username}`,
      friendshipId: friendship.id
    });

  } catch (error) {
    console.error('Error sending friend request:', error);
    return NextResponse.json({ error: "Failed to send friend request" }, { status: 500 });
  }
}