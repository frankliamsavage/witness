import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

/**
 * Approve a DOB change request and update the user's date of birth
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
    
    const { notes, idVerified } = await request.json();
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

    // Start transaction to update both the request and user's DOB
    const result = await prisma.$transaction(async (tx) => {
      // Update the change request
      const updatedRequest = await tx.dobChangeRequest.update({
        where: { id: requestId },
        data: {
          status: 'APPROVED',
          reviewedBy: user.id,
          reviewedAt: new Date(),
          adminNotes: notes || 'ID verified and approved by admin',
          idVerified: true,
          idVerifiedBy: user.id,
          idVerifiedAt: new Date()
        }
      });

      // Update the user's date of birth
      const newDOB = changeRequest.requestedDOB || changeRequest.currentDOB;
      await tx.user.update({
        where: { id: changeRequest.userId },
        data: {
          dateOfBirth: newDOB
        }
      });

      return updatedRequest;
    });

    // Log the approval for security audit
    console.log(`🔐 DOB Change Approved - Admin: ${user.id}, Request: ${requestId}, User: ${changeRequest.user.username}`);

    return NextResponse.json({
      success: true,
      message: 'DOB change request approved and user date of birth updated',
      requestId: result.id
    });

  } catch (error) {
    console.error('DOB request approval error:', error);
    return NextResponse.json(
      { error: 'Failed to approve request' },
      { status: 500 }
    );
  }
}