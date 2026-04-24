import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/friends/[id] - Accept/Reject friend request
export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action } = await request.json(); // 'accept' or 'reject'
    const params = await context.params;
    const friendshipId = params.id;

    if (!action || !['accept', 'reject'].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Get user's database ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the friendship request
    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
      include: {
        requester: { select: { username: true } },
        addressee: { select: { username: true } }
      }
    });

    if (!friendship) {
      return NextResponse.json({ error: "Friend request not found" }, { status: 404 });
    }

    // Verify the current user is the addressee (receiver of the request)
    if (friendship.addresseeId !== user.id) {
      return NextResponse.json({ error: "Unauthorized to modify this request" }, { status: 403 });
    }

    if (friendship.status !== 'PENDING') {
      return NextResponse.json({ error: "Friend request already processed" }, { status: 400 });
    }

    if (action === 'accept') {
      // Accept the friend request
      await prisma.friendship.update({
        where: { id: friendshipId },
        data: { status: 'ACCEPTED' }
      });

      return NextResponse.json({ 
        success: true, 
        message: `You are now friends with ${friendship.requester.username}`
      });
    } else {
      // Reject the friend request (delete it)
      await prisma.friendship.delete({
        where: { id: friendshipId }
      });

      return NextResponse.json({ 
        success: true, 
        message: "Friend request declined"
      });
    }

  } catch (error) {
    console.error('Error processing friend request:', error);
    return NextResponse.json({ error: "Failed to process friend request" }, { status: 500 });
  }
}

// DELETE /api/friends/[id] - Remove friend or cancel friend request
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const friendshipId = params.id;

    // Get user's database ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the friendship
    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId }
    });

    if (!friendship) {
      return NextResponse.json({ error: "Friendship not found" }, { status: 404 });
    }

    // Verify the current user is involved in this friendship
    if (friendship.requesterId !== user.id && friendship.addresseeId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the friendship
    await prisma.friendship.delete({
      where: { id: friendshipId }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Friendship removed"
    });

  } catch (error) {
    console.error('Error removing friendship:', error);
    return NextResponse.json({ error: "Failed to remove friendship" }, { status: 500 });
  }
}