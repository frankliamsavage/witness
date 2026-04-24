import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function checkProfilePermissions() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return {
        allowed: false,
        redirectTo: '/sign-in',
        reason: 'Not authenticated'
      };
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        dateOfBirth: true,
        canCreateProfile: true,
        ageVerified: true,
        contentModerationLevel: true
      }
    });

    if (!user) {
      return {
        allowed: false,
        redirectTo: '/age-verification',
        reason: 'User not found in database'
      };
    }

    if (!user.ageVerified) {
      return {
        allowed: false,
        redirectTo: '/age-verification',
        reason: 'Age not verified'
      };
    }

    // Calculate age if dateOfBirth is available
    let age: number | null = null;
    let isMinor = false;
    
    if (user.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(user.dateOfBirth);
      age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      isMinor = age < 18;
    }

    if (!user.canCreateProfile || isMinor) {
      return {
        allowed: false,
        redirectTo: '/public-content',
        reason: `Profile creation restricted - must be 18 or older (current age: ${age})`,
        isMinor: true,
        age: age
      };
    }

    return {
      allowed: true,
      user: {
        ...user,
        age: age,
        isMinor: isMinor
      }
    };

  } catch (error) {
    console.error('Error checking profile permissions:', error);
    return {
      allowed: false,
      redirectTo: '/sign-in',
      reason: 'Error checking permissions'
    };
  }
}

export async function enforceProfileRestrictions(request: Request) {
  const permissions = await checkProfilePermissions();
  
  if (!permissions.allowed) {
    if ('isMinor' in permissions && permissions.isMinor) {
      // Special handling for minors - redirect to public content with explanation
      const url = new URL('/public-content', request.url);
      url.searchParams.set('reason', 'age_restricted');
      url.searchParams.set('age', ('age' in permissions ? permissions.age?.toString() : '') || '');
      return NextResponse.redirect(url);
    }
    
    const url = new URL(permissions.redirectTo || '/sign-in', request.url);
    return NextResponse.redirect(url);
  }
  
  return null; // Allow to continue
}