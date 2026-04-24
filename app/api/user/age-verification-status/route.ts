import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

/**
 * GET /api/user/age-verification-status
 * Age verification is disabled - returns verified status for all users
 */
export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Age verification disabled - all users are treated as verified adults
    return NextResponse.json({
      ageVerified: true,
      isMinor: false,
      requiresParentalConsent: false,
      hasCompletedInitialVerification: true,
      dateOfBirth: null,
      age: null,
    });
  } catch (error) {
    console.error('Error checking age verification status:', error);
    return NextResponse.json(
      { error: 'Failed to check verification status' },
      { status: 500 }
    );
  }
}
