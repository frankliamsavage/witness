import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { 
  checkMessagingPermission, 
  filterMessageContent, 
  logMessageForSafety,
  getUserAge 
} from '@/lib/messagingSafety';

/**
 * COPPA COMPLIANT MESSAGING API
 * 
 * Enforces child safety rules for all messaging:
 * - Age verification required
 * - Minor-adult messaging restrictions
 * - Content filtering for inappropriate material
 * - Automatic safety logging and moderation
 */

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { recipientId, content, parentId } = await request.json();

    if (!recipientId || !content?.trim()) {
      return NextResponse.json({ 
        error: 'Recipient and message content are required' 
      }, { status: 400 });
    }

    // **STEP 1: CHECK MESSAGING PERMISSIONS**
    const permissionCheck = await checkMessagingPermission(userId, recipientId);
    
    if (!permissionCheck.allowed) {
      return NextResponse.json({
        error: permissionCheck.reason,
        requiresParentalApproval: permissionCheck.requiresParentalApproval,
        blocked: true
      }, { status: 403 });
    }

    // **STEP 2: GET USER AGES FOR CONTENT FILTERING**
    const [senderAge, recipientAge] = await Promise.all([
      getUserAge(userId),
      getUserAge(recipientId)
    ]);

    if (!senderAge || !recipientAge) {
      return NextResponse.json({
        error: 'User age verification failed'
      }, { status: 400 });
    }

    // **STEP 3: FILTER MESSAGE CONTENT**
    const contentFilter = filterMessageContent(
      content,
      senderAge.age,
      recipientAge.age
    );

    // **STEP 4: LOG FOR SAFETY MONITORING**
    await logMessageForSafety(
      userId,
      recipientId,
      content,
      contentFilter.flagged,
      contentFilter.flagReason
    );

    // **STEP 5: DETERMINE IF MESSAGE NEEDS MODERATION**
    const needsModeration = permissionCheck.requiresModeration || contentFilter.flagged;
    
    let messageStatus = 'SENT';
    if (needsModeration) {
      messageStatus = 'PENDING_REVIEW';
    }

    // **STEP 6: CREATE THE MESSAGE**
    const message = await prisma.message.create({
      data: {
        content: contentFilter.filteredContent,
        originalContent: contentFilter.flagged ? content : undefined,
        senderId: userId,
        receiverId: recipientId, // Use the existing field name
        parentId: parentId || null,
        status: messageStatus,
        flaggedForReview: contentFilter.flagged,
        flagReason: contentFilter.flagReason,
        requiresModeration: needsModeration
      }
    });

    // **STEP 7: CREATE NOTIFICATION (if message is approved)**
    if (messageStatus === 'SENT') {
      await prisma.notification.create({
        data: {
          userId: recipientId,
          type: 'NEW_MESSAGE',
          title: 'New Message',
          message: `You have a new message from ${senderAge.isMinor ? 'a user' : 'someone'}`,
          actionUrl: `/dashboard/inbox/${message.id}`,
          fromUserId: userId
        }
      });
    }

    // **STEP 8: RESPONSE BASED ON MODERATION STATUS**
    if (messageStatus === 'PENDING_REVIEW') {
      return NextResponse.json({
        success: true,
        messageId: message.id,
        status: 'pending_review',
        message: 'Your message is being reviewed for safety and will be delivered once approved.',
        isMinorInvolved: senderAge.isMinor || recipientAge.isMinor
      });
    }

    return NextResponse.json({
      success: true,
      messageId: message.id,
      status: 'sent',
      content: contentFilter.filteredContent,
      filtered: contentFilter.flagged
    });

  } catch (error) {
    console.error('🚨 Secure messaging error:', error);
    return NextResponse.json({ 
      error: 'Failed to send message. Please try again.' 
    }, { status: 500 });
  }
}

/**
 * GET - Retrieve messages with safety filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const conversationWith = url.searchParams.get('with');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    // Get user age for appropriate filtering
    const userAge = await getUserAge(userId);
    if (!userAge) {
      return NextResponse.json({
        error: 'Age verification required for messaging'
      }, { status: 403 });
    }

    let messages;
    
    if (conversationWith) {
      // Get conversation with specific user
      messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId, receiverId: conversationWith },
            { senderId: conversationWith, receiverId: userId }
          ],
          status: 'SENT' // Only show approved messages
        },
        orderBy: { createdAt: 'asc' },
        take: limit,
        include: {
          sender: {
            select: { 
              id: true, 
              username: true, 
              isMinor: true,
              profilePicture: true
            }
          },
          receiver: {
            select: { 
              id: true, 
              username: true, 
              isMinor: true,
              profilePicture: true
            }
          }
        }
      });
    } else {
      // Get all conversations for user
      messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId }
          ],
          status: 'SENT'
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          sender: {
            select: { 
              id: true, 
              username: true, 
              isMinor: true,
              profilePicture: true
            }
          },
          receiver: {
            select: { 
              id: true, 
              username: true, 
              isMinor: true,
              profilePicture: true
            }
          }
        }
      });
    }

    // Apply additional safety filtering for minors
    if (userAge.isMinor) {
      messages = messages.map(msg => ({
        ...msg,
        // Hide real usernames for minor safety
        sender: {
          ...msg.sender,
          username: msg.sender.isMinor ? msg.sender.username : 'Adult User'
        },
        receiver: {
          ...msg.receiver,
          username: msg.receiver.isMinor ? msg.receiver.username : 'Adult User'
        }
      }));
    }

    return NextResponse.json({ 
      messages,
      userIsMinor: userAge.isMinor 
    });

  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}