import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// Age verification disabled - all users are treated as verified adults
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Age verification is disabled
    // Simply return success for all requests
    return NextResponse.json({
      success: true,
      message: 'Age verification endpoint disabled - all users are treated as verified adults',
      ageVerified: true,
      isMinor: false,
      requiresParentalConsent: false
    });
    
  } catch (error) {
    console.error('Age verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify age' }, 
      { status: 500 }
    );
  }
}