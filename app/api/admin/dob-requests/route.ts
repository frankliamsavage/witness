import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

/**
 * Get all DOB change requests for admin review
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

    // TODO: Implement proper admin check
    // For now, allowing access for development
    
    const requests = await prisma.dobChangeRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            clerkId: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ 
      success: true,
      requests: requests.map(request => ({
        id: request.id,
        user: request.user,
        currentDOB: request.currentDOB,
        requestedDOB: request.requestedDOB,
        reason: request.reason,
        status: request.status,
        idDocumentType: request.idDocumentType,
        idDocumentUrl: request.idDocumentUrl,
        idDocumentHash: request.idDocumentHash,
        idVerified: request.idVerified,
        createdAt: request.createdAt,
        ipAddress: request.ipAddress,
        userAgent: request.userAgent,
        adminNotes: request.adminNotes
      }))
    });

  } catch (error) {
    console.error('Admin DOB requests fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}