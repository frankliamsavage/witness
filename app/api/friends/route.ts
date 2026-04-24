import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/friends - Get user's friends and friend requests
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's database ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all friendships (accepted friends)
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: user.id, status: 'ACCEPTED' },
          { addresseeId: user.id, status: 'ACCEPTED' }
        ]
      },
      include: {
        requester: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
            isVerified: true
          }
        },
        addressee: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
            isVerified: true
          }
        }
      }
    });

    // Get pending friend requests sent to this user
    const pendingRequests = await prisma.friendship.findMany({
      where: {
        addresseeId: user.id,
        status: 'PENDING'
      },
      include: {
        requester: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
            isVerified: true
          }
        }
      }
    });

    // Get pending friend requests sent by this user
    const sentRequests = await prisma.friendship.findMany({
      where: {
        requesterId: user.id,
        status: 'PENDING'
      },
      include: {
        addressee: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
            isVerified: true
          }
        }
      }
    });

    // Format friends list
    const friends = friendships.map(friendship => {
      const friend = friendship.requesterId === user.id ? friendship.addressee : friendship.requester;
      return {
        id: friend.id,
        username: friend.username,
        profilePicture: friend.profilePicture,
        isVerified: friend.isVerified,
        friendshipId: friendship.id
      };
    });

    return NextResponse.json({
      success: true,
      friends,
      pendingRequests: pendingRequests.map(req => ({
        id: req.id,
        user: req.requester
      })),
      sentRequests: sentRequests.map(req => ({
        id: req.id,
        user: req.addressee
      }))
    });

  } catch (error) {
    console.error('Error fetching friends:', error);
    return NextResponse.json({ error: "Failed to fetch friends" }, { status: 500 });
  }
}

// POST /api/friends - Send friend request
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetUsername } = await request.json();

    if (!targetUsername) {
      return NextResponse.json({ error: "Target username is required" }, { status: 400 });
    }

    // Get both users
    const [user, targetUser] = await Promise.all([
      prisma.user.findUnique({
        where: { clerkId: userId },
        select: { id: true }
      }),
      prisma.user.findUnique({
        where: { username: targetUsername },
        select: { id: true, username: true }
      })
    ]);

    if (!user || !targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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