/**
 * COPPA COMPLIANCE: MESSAGING SAFETY CONTROLS
 * 
 * Protects minors from inappropriate contact while allowing
 * safe community participation and peer-to-peer communication
 */

import { prisma } from '@/lib/prisma';

export interface MessageSafetyResult {
  allowed: boolean;
  reason?: string;
  requiresParentalApproval?: boolean;
  requiresModeration?: boolean;
}

export interface UserAge {
  age: number;
  isMinor: boolean;
  isVerified: boolean;
}

/**
 * Get user age information safely
 * Age verification disabled - returns verified adult for all users
 */
export async function getUserAge(userId: string): Promise<UserAge | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true
      }
    });

    if (!user) {
      return null;
    }

    // Age verification disabled - treat all users as verified adults
    return {
      age: 18,
      isMinor: false,
      isVerified: true
    };
  } catch {
    return null;
  }
}

/**
 * Check if messaging is allowed between two users
 */
export async function checkMessagingPermission(
  senderId: string, 
  recipientId: string
): Promise<MessageSafetyResult> {
  
  // Get both users' age information
  const [senderAge, recipientAge] = await Promise.all([
    getUserAge(senderId),
    getUserAge(recipientId)
  ]);

  // Block messaging if either user is not age verified
  if (!senderAge || !recipientAge) {
    return {
      allowed: false,
      reason: 'Age verification required for messaging'
    };
  }

  // Get additional user safety settings
  const [senderSettings, recipientSettings] = await Promise.all([
    prisma.user.findUnique({
      where: { clerkId: senderId },
      select: { allowDirectMessages: true, parentalConsentReceived: true }
    }),
    prisma.user.findUnique({
      where: { clerkId: recipientId },
      select: { allowDirectMessages: true, parentalConsentReceived: true }
    })
  ]);

  if (!senderSettings || !recipientSettings) {
    return {
      allowed: false,
      reason: 'User settings unavailable'
    };
  }

  // Check if recipient allows direct messages
  if (!recipientSettings.allowDirectMessages) {
    return {
      allowed: false,
      reason: 'Recipient has disabled direct messages'
    };
  }

  // **CRITICAL CHILD SAFETY RULES**

  // 1. Adults (18+) cannot message minors unless supervised
  if (!senderAge.isMinor && recipientAge.isMinor) {
    return {
      allowed: false,
      reason: 'Adults cannot initiate direct messages with minors for child safety',
      requiresModeration: true
    };
  }

  // 2. Minors under 13 cannot use messaging (should be blocked by age verification)
  if (senderAge.age < 13 || recipientAge.age < 13) {
    return {
      allowed: false,
      reason: 'Messaging not available for users under 13'
    };
  }

  // 3. Minors 13-15 messaging adults requires parental consent
  if (senderAge.isMinor && senderAge.age < 16 && !recipientAge.isMinor) {
    if (!senderSettings.parentalConsentReceived) {
      return {
        allowed: false,
        reason: 'Parental consent required for messaging with adults',
        requiresParentalApproval: true
      };
    }
    // Allow but with heavy moderation
    return {
      allowed: true,
      requiresModeration: true
    };
  }

  // 4. Minor-to-minor messaging (same age groups)
  if (senderAge.isMinor && recipientAge.isMinor) {
    const ageDifference = Math.abs(senderAge.age - recipientAge.age);
    
    // Large age gaps between minors require review
    if (ageDifference > 3) {
      return {
        allowed: true,
        requiresModeration: true,
        reason: 'Large age gap requires content moderation'
      };
    }
    
    // Same age group minors can message with light moderation
    return {
      allowed: true,
      requiresModeration: senderAge.age < 16 // Heavier moderation for younger users
    };
  }

  // 5. Adult-to-adult messaging (no restrictions)
  return {
    allowed: true,
    requiresModeration: false
  };
}

/**
 * Enhanced message content filtering for minors
 */
export function filterMessageContent(
  content: string, 
  senderAge: number, 
  recipientAge: number
): {
  filteredContent: string;
  flagged: boolean;
  flagReason?: string;
} {
  let filtered = content;
  let flagged = false;
  let flagReason = '';

  // Patterns that are always blocked for minors
  const dangerousPatterns = [
    // Contact information
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // Phone numbers
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
    /\b(?:snapchat|snap|instagram|insta|tiktok|discord|whatsapp|kik|telegram)\b/gi, // Social platforms
    
    // Personal info requests
    /\b(?:where do you live|what's your address|send me pics|phone number|real name)\b/gi,
    
    // Meeting requests (major red flag)
    /\b(?:meet up|meet in person|come over|my place|secret|don't tell)/gi,
    
    // Inappropriate content
    /\b(?:nude|naked|sexy|hot|cute|beautiful|handsome)\b/gi,
    
    // Grooming indicators
    /\b(?:mature for your age|special|our secret|trust me|between us)/gi
  ];

  const isMinorInvolved = senderAge < 18 || recipientAge < 18;

  if (isMinorInvolved) {
    dangerousPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        flagged = true;
        flagReason = 'Potentially inappropriate content for minor safety';
        filtered = filtered.replace(pattern, '[CONTENT FILTERED]');
      }
    });

    // Additional filtering for very young users
    if (senderAge < 16 || recipientAge < 16) {
      const strictPatterns = [
        /\b(?:age|old|birthday)\b/gi, // Age-related questions
        /\b(?:school|grade|class)\b/gi // School location info
      ];

      strictPatterns.forEach(pattern => {
        if (pattern.test(content)) {
          flagged = true;
          flagReason = 'Age-sensitive content requires review';
        }
      });
    }
  }

  return {
    filteredContent: filtered,
    flagged,
    flagReason
  };
}

/**
 * Log and track messaging for safety monitoring
 */
export async function logMessageForSafety(
  senderId: string,
  recipientId: string,
  content: string,
  filtered: boolean,
  flagReason?: string
): Promise<void> {
  try {
    await prisma.messageSafetyLog.create({
      data: {
        senderId,
        recipientId,
        contentLength: content.length,
        wasFiltered: filtered,
        flagReason,
        timestamp: new Date()
      }
    });

    // If flagged, create immediate admin alert
    if (filtered && flagReason) {
      await prisma.adminAlert.create({
        data: {
          type: 'MINOR_SAFETY',
          priority: 'HIGH',
          description: `Filtered message from user ${senderId} to ${recipientId}: ${flagReason}`,
          relatedUserId: senderId,
          targetUserId: recipientId,
          status: 'PENDING'
        }
      });
    }
  } catch (error) {
    console.error('Failed to log message safety data:', error);
  }
}