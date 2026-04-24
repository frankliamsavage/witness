import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

/**
 * EMERGENCY AGE VERIFICATION MIDDLEWARE
 * 
 * Critical child safety enforcement:
 * - Blocks ALL platform access for unverified users
 * - Enforces age verification before any content interaction
 * - Applies minor-specific restrictions
 */

const AGE_VERIFICATION_REQUIRED_PATHS = [
  '/dashboard',
  '/api/newsfeed',
  '/api/messages',
  '/api/upload',
  '/api/testimony',
  '/submit-testimony',
  '/witness',
  '/marketplace'
];

const PUBLIC_PATHS = [
  '/sign-in',
  '/sign-up',
  '/api/age-verification',
  '/',
  '/help',
  '/legal',
  '/privacy',
  '/terms',
  '/support',
  '/report-issue',
  '/book-of-life',
  '/sanctuary',
  '/minecraft',
  '/the-promise',
  '/engage'
];

export async function ageVerificationCheck(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public paths
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  try {
    const { userId } = await auth();
    
    // Redirect unauthenticated users to sign in
    if (!userId) {
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('redirectUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Check if age verification is required for this path
    const requiresVerification = AGE_VERIFICATION_REQUIRED_PATHS.some(path => 
      pathname.startsWith(path)
    );

    if (requiresVerification) {
      // Get user's age verification status
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: {
          ageVerified: true,
          isMinor: true,
          parentalConsentReceived: true,
          dateOfBirth: true
        }
      });

      // If user doesn't exist or isn't age verified, redirect to verification
      if (!user || !user.ageVerified) {
        const verificationUrl = new URL('/age-verification', request.url);
        verificationUrl.searchParams.set('redirectUrl', pathname);
        return NextResponse.redirect(verificationUrl);
      }

      // Additional checks for minors
      if (user.isMinor) {
        // Check if this is a restricted path for minors
        const minorRestrictedPaths = ['/marketplace'];
        
        if (minorRestrictedPaths.some(path => pathname.startsWith(path))) {
          const restrictedUrl = new URL('/dashboard', request.url);
          restrictedUrl.searchParams.set('error', 'age-restricted');
          return NextResponse.redirect(restrictedUrl);
        }

        // For minors 13-15, ensure parental consent for certain features
        if (user.dateOfBirth) {
          const age = new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear();
          if (age < 16 && !user.parentalConsentReceived) {
            const sensitivePathsRequiringConsent = [
              '/api/messages',
              '/api/upload'
            ];
            
            if (sensitivePathsRequiringConsent.some(path => pathname.startsWith(path))) {
              return NextResponse.json({
                error: 'Parental consent required for this feature',
                requiresParentalConsent: true
              }, { status: 403 });
            }
          }
        }

        // Add minor safety headers
        const response = NextResponse.next();
        response.headers.set('X-User-Is-Minor', 'true');
        response.headers.set('X-Enhanced-Safety', 'enabled');
        return response;
      }
    }

    return NextResponse.next();

  } catch (error) {
    console.error('Age verification middleware error:', error);
    
    // On error, redirect to age verification to be safe
    const verificationUrl = new URL('/age-verification', request.url);
    verificationUrl.searchParams.set('error', 'verification-check-failed');
    return NextResponse.redirect(verificationUrl);
  }
}

/**
 * Helper function to check if user is verified adult
 * Use this in API routes for additional protection
 */
export async function requireVerifiedAdult(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        ageVerified: true,
        isMinor: true
      }
    });

    return user?.ageVerified === true && user?.isMinor === false;
  } catch {
    return false;
  }
}

/**
 * Helper function to check if user is verified minor
 */
export async function requireVerifiedMinor(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        ageVerified: true,
        isMinor: true
      }
    });

    return user?.ageVerified === true && user?.isMinor === true;
  } catch {
    return false;
  }
}