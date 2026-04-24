import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Check if a user has found the light and is ready to enter the Sanctuary
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({
        hasFoundLight: false,
        message: 'Authentication required to seek the light'
      });
    }

    // Check if user has completed the journey to find the light
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        sanctuaryAccess: true,
        lightFoundDate: true,
        spiritualJourneyCompleted: true
      }
    });

    return NextResponse.json({
      hasFoundLight: user?.sanctuaryAccess || false,
      lightFoundDate: user?.lightFoundDate,
      journeyCompleted: user?.spiritualJourneyCompleted || false
    });

  } catch (error) {
    console.error('Error checking sanctuary access:', error);
    return NextResponse.json({
      hasFoundLight: false,
      message: 'Error checking spiritual readiness'
    }, { status: 500 });
  }
}

/**
 * Record when someone has found the light and grant sanctuary access
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { lightFound, testimonialOfFaith, scriptureReference } = await request.json();

    if (!lightFound || !testimonialOfFaith) {
      return NextResponse.json(
        { error: 'Testimonial of faith required to enter the Sanctuary' },
        { status: 400 }
      );
    }

    // Update user to grant sanctuary access
    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        sanctuaryAccess: true,
        lightFoundDate: new Date(),
        spiritualJourneyCompleted: true,
        faithTestimonial: testimonialOfFaith,
        scriptureFoundation: scriptureReference || null
      }
    });

    console.log(`🕊️ User ${userId} has found the light and entered the Sanctuary`);

    return NextResponse.json({
      success: true,
      message: '🕊️ The veil has been lifted. Welcome to the Sanctuary, child of light.',
      accessGranted: true
    });

  } catch (error) {
    console.error('Error granting sanctuary access:', error);
    return NextResponse.json(
      { error: 'Error processing spiritual journey' },
      { status: 500 }
    );
  }
}