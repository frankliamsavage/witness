import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const admin = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { isAdmin: true, id: true }
    });

    if (!admin?.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { reportId, status, adminNotes } = await request.json();

    if (!reportId || !status) {
      return NextResponse.json(
        { error: 'Report ID and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['PENDING', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update the report
    const updatedReport = await prisma.userReport.update({
      where: { id: reportId },
      data: {
        status,
        adminNotes: adminNotes || null,
        resolvedAt: ['RESOLVED', 'DISMISSED'].includes(status) ? new Date() : null,
        resolvedBy: ['RESOLVED', 'DISMISSED'].includes(status) ? admin.id : null
      },
      include: {
        reportedUser: {
          select: { username: true }
        },
        reporter: {
          select: { username: true }
        }
      }
    });

    console.log(`📋 User report updated:`, {
      reportId: updatedReport.id,
      newStatus: status,
      adminId: admin.id
    });

    return NextResponse.json({
      success: true,
      report: updatedReport
    });

  } catch (error) {
    console.error('❌ Error updating user report:', error);
    return NextResponse.json(
      { error: 'Failed to update report' },
      { status: 500 }
    );
  }
}