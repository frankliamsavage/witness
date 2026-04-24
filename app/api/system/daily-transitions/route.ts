import { NextRequest, NextResponse } from 'next/server';
import { processPendingTransitions } from '@/lib/accountTransitions';
import { scheduleAccountTransition } from '@/lib/accountTransitions';
import { prisma } from '@/lib/prisma';

/**
 * COPPA COMPLIANCE: DAILY TRANSITION SCHEDULER
 * 
 * API endpoint to:
 * 1. Process accounts turning 18 today
 * 2. Schedule future transitions for new minor users
 * 3. Update age-based restrictions automatically
 * 
 * This should be called daily via cron job or scheduled task
 */

export async function POST(request: NextRequest) {
  try {
    // Verify this is an authorized system call
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.SYSTEM_SCHEDULER_TOKEN;
    
    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🎂 Starting daily account transition processing...');

    // **STEP 1: Process accounts turning 18 today**
    const transitionResults = await processPendingTransitions();
    
    // **STEP 2: Schedule transitions for new minor users**
    const newMinorUsers = await prisma.user.findMany({
      where: {
        isMinor: true,
        ageVerified: true,
        // Users who don't have transitions scheduled yet
        accountTransitions: {
          none: {
            transitionType: 'MINOR_TO_ADULT',
            completedAt: null
          }
        }
      },
      select: {
        clerkId: true,
        dateOfBirth: true,
        username: true
      }
    });

    const schedulingPromises = newMinorUsers.map(user => 
      scheduleAccountTransition(user.clerkId)
    );
    
    await Promise.allSettled(schedulingPromises);

    // **STEP 3: Update age-based restrictions for all users**
    const today = new Date();
    const usersToUpdate = await prisma.user.findMany({
      where: {
        ageVerified: true,
        dateOfBirth: { not: null }
      },
      select: {
        id: true,
        clerkId: true,
        dateOfBirth: true,
        isMinor: true
      }
    });

    let ageUpdatesCount = 0;
    
    for (const user of usersToUpdate) {
      if (!user.dateOfBirth) continue;
      
      const birthDate = new Date(user.dateOfBirth);
      const currentAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
        ? currentAge - 1 
        : currentAge;

      const shouldBeMinor = actualAge < 18;
      
      // Update if status doesn't match current age
      if (user.isMinor !== shouldBeMinor) {
        await prisma.user.update({
          where: { id: user.id },
          data: { isMinor: shouldBeMinor }
        });
        ageUpdatesCount++;
      }
    }

    // **STEP 4: Generate summary report**
    const summary = {
      transitionsProcessed: transitionResults.length,
      successfulTransitions: transitionResults.filter(r => r.success).length,
      failedTransitions: transitionResults.filter(r => !r.success).length,
      newTransitionsScheduled: newMinorUsers.length,
      ageStatusUpdates: ageUpdatesCount,
      timestamp: new Date().toISOString()
    };

    console.log('🎂 Daily transition processing complete:', summary);

    return NextResponse.json({
      success: true,
      summary,
      transitions: transitionResults
    });

  } catch (error) {
    console.error('❌ Daily transition processing failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * GET - Status report on pending transitions
 */
export async function GET() {
  try {
    // Get upcoming transitions in next 30 days
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    
    const upcomingTransitions = await prisma.accountTransition.findMany({
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
            dateOfBirth: true
          }
        }
      },
      orderBy: {
        scheduledDate: 'asc'
      }
    });

    // Get statistics
    const stats = {
      totalMinorUsers: await prisma.user.count({
        where: { isMinor: true, ageVerified: true }
      }),
      totalAdultUsers: await prisma.user.count({
        where: { isMinor: false, ageVerified: true }
      }),
      upcomingTransitions: upcomingTransitions.length,
      nextTransition: upcomingTransitions[0]?.scheduledDate || null
    };

    return NextResponse.json({
      stats,
      upcomingTransitions: upcomingTransitions.slice(0, 10) // First 10
    });

  } catch (error) {
    console.error('Failed to get transition status:', error);
    return NextResponse.json({
      error: 'Failed to fetch transition status'
    }, { status: 500 });
  }
}