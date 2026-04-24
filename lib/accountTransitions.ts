/**
 * COPPA COMPLIANCE: AUTOMATIC ACCOUNT TRANSITIONS
 * 
 * Handles the transition of minor accounts to adult status
 * on their 18th birthday with expanded privileges and features
 */

import { prisma } from '@/lib/prisma';
import { clerkClient } from '@clerk/nextjs/server';

interface TransitionResult {
  success: boolean;
  userId?: string;
  newPrivileges?: string[];
  error?: string;
}

/**
 * Schedule account transition for a minor user on their 18th birthday
 */
export async function scheduleAccountTransition(userId: string): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        dateOfBirth: true,
        isMinor: true,
        ageVerified: true
      }
    });

    if (!user || !user.ageVerified || !user.dateOfBirth || !user.isMinor) {
      return; // Not applicable for this user
    }

    // Calculate 18th birthday
    const birthDate = new Date(user.dateOfBirth);
    const eighteenthBirthday = new Date(
      birthDate.getFullYear() + 18,
      birthDate.getMonth(),
      birthDate.getDate(),
      0, 0, 0 // Midnight on their birthday
    );

    // Check if transition is already scheduled
    const existingTransition = await prisma.accountTransition.findFirst({
      where: {
        userId: user.id,
        transitionType: 'MINOR_TO_ADULT',
        completedAt: null
      }
    });

    if (existingTransition) {
      return; // Already scheduled
    }

    // Schedule the transition
    await prisma.accountTransition.create({
      data: {
        userId: user.id,
        transitionType: 'MINOR_TO_ADULT',
        fromStatus: 'MINOR',
        toStatus: 'ADULT',
        scheduledDate: eighteenthBirthday,
        notes: 'Automatic transition from minor to adult status on 18th birthday'
      }
    });

    console.log(`🎂 Scheduled account transition for user ${userId} on ${eighteenthBirthday.toDateString()}`);

  } catch (error) {
    console.error('Failed to schedule account transition:', error);
  }
}

/**
 * Check for and process pending account transitions
 * This should be run daily via a cron job or scheduled task
 */
export async function processPendingTransitions(): Promise<TransitionResult[]> {
  const results: TransitionResult[] = [];
  
  try {
    const today = new Date();
    
    // Get all pending transitions that are due
    const dueTransitions = await prisma.accountTransition.findMany({
      where: {
        scheduledDate: {
          lte: today
        },
        completedAt: null
      },
      include: {
        user: {
          select: {
            id: true,
            clerkId: true,
            username: true,
            dateOfBirth: true,
            isMinor: true
          }
        }
      }
    });

    for (const transition of dueTransitions) {
      try {
        const result = await executeAccountTransition(transition.user.clerkId);
        results.push(result);

        // Mark transition as completed
        await prisma.accountTransition.update({
          where: { id: transition.id },
          data: {
            completedAt: new Date(),
            notes: result.success 
              ? `Successfully transitioned to adult status. New privileges: ${result.newPrivileges?.join(', ')}`
              : `Transition failed: ${result.error}`
          }
        });

      } catch (error) {
        console.error(`Failed to process transition for user ${transition.user.clerkId}:`, error);
        results.push({
          success: false,
          userId: transition.user.clerkId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    if (dueTransitions.length > 0) {
      console.log(`🎂 Processed ${dueTransitions.length} account transitions. ${results.filter(r => r.success).length} successful.`);
    }

    return results;

  } catch (error) {
    console.error('Failed to process pending transitions:', error);
    return [{ success: false, error: 'Failed to process transitions' }];
  }
}

/**
 * Execute the actual account transition from minor to adult
 */
export async function executeAccountTransition(userId: string): Promise<TransitionResult> {
  try {
    // Verify user's current age
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        clerkId: true,
        dateOfBirth: true,
        isMinor: true,
        username: true
      }
    });

    if (!user || !user.dateOfBirth) {
      return {
        success: false,
        userId,
        error: 'User not found or missing birth date'
      };
    }

    // Calculate current age
    const today = new Date();
    const birthDate = new Date(user.dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
      ? age - 1 
      : age;

    if (actualAge < 18) {
      return {
        success: false,
        userId,
        error: `User is only ${actualAge} years old, not yet 18`
      };
    }

    // **UPGRADE TO ADULT PRIVILEGES**
    const newPrivileges = [
      'Direct messaging with all users',
      'Full profile visibility controls',
      'Access to marketplace features', 
      'Unrestricted content uploads',
      'Adult community participation',
      'Enhanced privacy settings'
    ];

    // Update user status in database
    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        isMinor: false,
        // Enable adult privileges
        allowDirectMessages: true,
        profilePrivate: false, // Let them choose
        showInSearch: true,
        requireFollowApproval: false,
        // Remove parental consent requirement
        parentalConsentReceived: false, // No longer needed
        updatedAt: new Date()
      }
    });

    // Update Clerk metadata
    const clerk = await clerkClient();
    await clerk.users.updateUser(userId, {
      publicMetadata: {
        isMinor: false,
        age: actualAge,
        transitionedToAdult: true,
        transitionDate: today.toISOString()
      }
    });

    // Create welcome notification for new adult
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'SYSTEM_UPDATE',
        title: '🎉 Welcome to Adulthood!',
        message: `Happy 18th Birthday! Your account has been upgraded with full adult privileges. You now have access to all platform features and can participate in adult communities. Your previous safety protections have been lifted, giving you complete control over your experience.`,
        isRead: false
      }
    });

    console.log(`🎂 Successfully transitioned user ${user.username} (${userId}) to adult status on their 18th birthday`);

    return {
      success: true,
      userId,
      newPrivileges
    };

  } catch (error) {
    console.error(`Account transition failed for user ${userId}:`, error);
    return {
      success: false,
      userId,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Manual transition trigger for testing or edge cases
 */
export async function triggerManualTransition(
  adminUserId: string,
  targetUserId: string,
  reason: string
): Promise<TransitionResult> {
  try {
    // Verify admin permissions
    const admin = await prisma.user.findUnique({
      where: { clerkId: adminUserId },
      select: { isAdmin: true, username: true }
    });

    if (!admin?.isAdmin) {
      return {
        success: false,
        error: 'Admin permissions required'
      };
    }

    const result = await executeAccountTransition(targetUserId);

    if (result.success) {
      // Log manual transition
      await prisma.accountTransition.create({
        data: {
          user: { connect: { clerkId: targetUserId } },
          transitionType: 'MANUAL_ADMIN_OVERRIDE',
          fromStatus: 'MINOR',
          toStatus: 'ADULT',
          scheduledDate: new Date(),
          completedAt: new Date(),
          notes: `Manual transition by admin ${admin.username}: ${reason}`
        }
      });
    }

    return result;

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Manual transition failed'
    };
  }
}

/**
 * Get upcoming transitions for admin dashboard
 */
export async function getUpcomingTransitions(days: number = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  return await prisma.accountTransition.findMany({
    where: {
      scheduledDate: {
        gte: new Date(),
        lte: futureDate
      },
      completedAt: null
    },
    include: {
      user: {
        select: {
          username: true,
          clerkId: true,
          dateOfBirth: true
        }
      }
    },
    orderBy: {
      scheduledDate: 'asc'
    }
  });
}