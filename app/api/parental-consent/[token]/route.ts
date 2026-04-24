import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const consentRequest = await prisma.parentalConsent.findUnique({
      where: { consentToken: token },
      include: {
        user: {
          select: {
            username: true,
            age: true
          }
        }
      }
    });

    if (!consentRequest) {
      return NextResponse.json({ error: 'Invalid or expired consent link' }, { status: 404 });
    }

    if (consentRequest.status !== 'PENDING') {
      return NextResponse.json({ error: 'This consent request has already been processed' }, { status: 400 });
    }

    if (new Date() > consentRequest.expiresAt) {
      await prisma.parentalConsent.update({
        where: { id: consentRequest.id },
        data: { status: 'EXPIRED' }
      });
      return NextResponse.json({ error: 'This consent request has expired' }, { status: 400 });
    }

    return NextResponse.json({
      id: consentRequest.id,
      parentEmail: consentRequest.parentEmail,
      parentName: consentRequest.parentName,
      relationship: consentRequest.relationship,
      user: consentRequest.user,
      expiresAt: consentRequest.expiresAt,
      status: consentRequest.status
    });
    
  } catch (error) {
    console.error('Get parental consent error:', error);
    return NextResponse.json(
      { error: 'Failed to load consent request' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const { decision } = await request.json();
    
    if (!token || !decision) {
      return NextResponse.json({ error: 'Token and decision are required' }, { status: 400 });
    }

    if (!['APPROVED', 'DENIED'].includes(decision)) {
      return NextResponse.json({ error: 'Invalid decision' }, { status: 400 });
    }

    const consentRequest = await prisma.parentalConsent.findUnique({
      where: { consentToken: token },
      include: { user: true }
    });

    if (!consentRequest) {
      return NextResponse.json({ error: 'Invalid consent token' }, { status: 404 });
    }

    if (consentRequest.status !== 'PENDING') {
      return NextResponse.json({ error: 'This consent request has already been processed' }, { status: 400 });
    }

    if (new Date() > consentRequest.expiresAt) {
      return NextResponse.json({ error: 'This consent request has expired' }, { status: 400 });
    }

    // Get request headers for verification tracking
    const userAgent = request.headers.get('user-agent') || '';
    const forwardedFor = request.headers.get('x-forwarded-for') || '';
    const realIp = request.headers.get('x-real-ip') || '';
    const ipAddress = forwardedFor.split(',')[0] || realIp || 'unknown';

    // Update consent request
    const updatedConsent = await prisma.parentalConsent.update({
      where: { id: consentRequest.id },
      data: {
        status: decision,
        verifiedAt: new Date(),
        consentGivenAt: decision === 'APPROVED' ? new Date() : null,
        parentVerificationMethod: 'email',
        parentIpAddress: ipAddress,
        parentUserAgent: userAgent
      }
    });

    // If approved, update user status
    if (decision === 'APPROVED') {
      await prisma.user.update({
        where: { id: consentRequest.userId },
        data: {
          parentalConsentReceived: true
        }
      });

      // Could also update Clerk metadata here if needed
    }

    return NextResponse.json({
      success: true,
      decision,
      message: `Consent ${decision.toLowerCase()} successfully`
    });
    
  } catch (error) {
    console.error('Process parental consent error:', error);
    return NextResponse.json(
      { error: 'Failed to process consent decision' }, 
      { status: 500 }
    );
  }
}