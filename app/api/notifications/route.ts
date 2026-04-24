import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Create a notification
export async function POST(request: NextRequest) {
  try {
    const { userId, type, title, message, fromUserId, postId, commentId, actionUrl } = await request.json();

    if (!userId || !type || !title || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Don't create notification if user is notifying themselves
    if (userId === fromUserId) {
      return NextResponse.json({ success: true, message: 'No self-notification created' });
    }

    // Create the notification
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        fromUserId: fromUserId || null,
        postId: postId || null,
        commentId: commentId || null,
        actionUrl: actionUrl || null,
      },
      include: {
        fromUser: {
          select: {
            username: true,
            profilePicture: true,
          }
        }
      }
    });

    console.log(`📬 Notification created: ${type} for user ${userId}`);
    return NextResponse.json({ success: true, notification });

  } catch (error) {
    console.error('❌ Error creating notification:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}

// Get user notifications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const whereClause: any = { userId };
    if (unreadOnly) {
      whereClause.isRead = false;
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      include: {
        fromUser: {
          select: {
            username: true,
            profilePicture: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset,
    });

    const unreadCount = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      }
    });

    return NextResponse.json({ 
      success: true, 
      notifications, 
      unreadCount 
    });

  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

// Mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const { notificationIds, userId, markAllRead } = await request.json();

    if (markAllRead && userId) {
      // Mark all notifications as read for this user
      await prisma.notification.updateMany({
        where: {
          userId,
          isRead: false,
        },
        data: {
          isRead: true,
        }
      });

      console.log(`📬 Marked all notifications as read for user ${userId}`);
      return NextResponse.json({ success: true, message: 'All notifications marked as read' });

    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      await prisma.notification.updateMany({
        where: {
          id: { in: notificationIds },
          isRead: false,
        },
        data: {
          isRead: true,
        }
      });

      console.log(`📬 Marked ${notificationIds.length} notifications as read`);
      return NextResponse.json({ success: true, message: 'Notifications marked as read' });

    } else {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Error updating notifications:', error);
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}