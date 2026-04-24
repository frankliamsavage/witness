import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

/**
 * Deny a DOB change request
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // TODO: Implement proper admin check
    
    const { notes } = await request.json();
    const { id: requestId } = await params;

    // Get the change request
    const changeRequest = await prisma.dobChangeRequest.findUnique({
      where: { id: requestId },
      include: { user: true }
    });

    if (!changeRequest) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }

    if (changeRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Request has already been processed' },
        { status: 400 }
      );
    }

    // Update the change request status to denied
    const updatedRequest = await prisma.dobChangeRequest.update({
      where: { id: requestId },
      data: {
        status: 'DENIED',
        reviewedBy: user.id,
        reviewedAt: new Date(),
        adminNotes: notes || 'ID verification failed or insufficient documentation',
        idVerified: false
      }
    });

    // Log the denial for security audit
    console.log(`❌ DOB Change Denied - Admin: ${user.id}, Request: ${requestId}, User: ${changeRequest.user.username}, Reason: ${notes}`);

    return NextResponse.json({
      success: true,
      message: 'DOB change request denied',
      requestId: updatedRequest.id
    });

  } catch (error) {
    console.error('DOB request denial error:', error);
    return NextResponse.json(
      { error: 'Failed to deny request' },
      { status: 500 }
    );
  }
}