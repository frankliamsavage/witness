import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        parentalConsent: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.requiresParentalConsent) {
      return NextResponse.json({ 
        needsConsent: false,
        reason: 'User does not require parental consent'
      });
    }

    if (!user.parentalConsent) {
      return NextResponse.json({ 
        needsConsent: true,
        reason: 'No consent request has been made'
      });
    }

    const consent = user.parentalConsent;
    
    return NextResponse.json({
      needsConsent: consent.status !== 'APPROVED',
      consentStatus: consent.status,
      consentRequest: {
        id: consent.id,
        parentEmail: consent.parentEmail,
        parentName: consent.parentName,
        relationship: consent.relationship,
        createdAt: consent.createdAt,
        expiresAt: consent.expiresAt,
        status: consent.status
      }
    });
    
  } catch (error) {
    console.error('Parental consent status error:', error);
    return NextResponse.json(
      { error: 'Failed to check parental consent status' }, 
      { status: 500 }
    );
  }
}