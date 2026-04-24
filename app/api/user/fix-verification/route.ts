import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

/**
 * EMERGENCY: Fix existing users who are stuck in age verification loop
 * This endpoint updates existing users to mark them as having completed verification
 */
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Update existing user to mark them as having completed initial verification
    const dbUser = await prisma.user.update({
      where: { clerkId: user.id },
      data: {
        hasCompletedInitialVerification: true,
        ageVerified: true,
        ageVerificationDate: new Date(),
      }
    });

    console.log('✅ Fixed user verification status:', {
      userId: dbUser.id,
      clerkId: user.id,
      hasCompletedInitialVerification: true,
    });

    return NextResponse.json({ 
      success: true,
      message: 'Verification status updated successfully' 
    });

  } catch (error) {
    console.error('Fix verification status error:', error);
    return NextResponse.json(
      { error: 'Failed to update verification status' },
      { status: 500 }
    );
  }
}