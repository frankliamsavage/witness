import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const admin = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { isAdmin: true }
    });
    
    console.log('👤 User admin status:', { userId, isAdmin: admin?.isAdmin });

    if (!admin?.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'PENDING';
    
    console.log('🔍 Post reports API called with status:', status);

    // Build where clause
    const whereClause: any = {};
    if (status !== 'ALL') {
      whereClause.status = status;
    }
    
    console.log('🔍 Query where clause:', whereClause);

    const reports = await prisma.postReport.findMany({
      where: whereClause,
      include: {
        post: {
          select: {
            id: true,
            content: true,
            imageUrls: true,
            videoUrl: true,
            author: {
              select: {
                id: true,
                username: true,
                email: true,
                profilePicture: true
              }
            }
          }
        },
        reporter: {
          select: {
            id: true,
            username: true,
            email: true,
            profilePicture: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log('📋 Found', reports.length, 'post reports');
    console.log('📋 Reports:', reports.map(r => ({ id: r.id, status: r.status, reason: r.reason })));

    return NextResponse.json({
      success: true,
      reports
    });

  } catch (error) {
    console.error('❌ Error fetching post reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post reports' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const admin = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { isAdmin: true, id: true, username: true }
    });

    if (!admin?.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { reportId, status, adminNotes, isUpdate } = await request.json();

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

    // Get the current report to check if we need to append to existing notes
    const currentReport = await prisma.postReport.findUnique({
      where: { id: reportId },
      select: { adminNotes: true }
    });

    if (!currentReport) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Determine final admin notes
    let finalAdminNotes = adminNotes || '';
    
    if (isUpdate && currentReport.adminNotes) {
      // For updates, append to existing notes
      finalAdminNotes = currentReport.adminNotes + '\n\n' + adminNotes;
    }

    // Update the report
    const updatedReport = await prisma.postReport.update({
      where: { id: reportId },
      data: {
        status,
        adminNotes: finalAdminNotes || null,
        resolvedAt: ['RESOLVED', 'DISMISSED'].includes(status) ? new Date() : null,
        resolvedBy: ['RESOLVED', 'DISMISSED'].includes(status) ? admin.id : null
      },
      include: {
        post: {
          include: {
            author: {
              select: { username: true }
            }
          }
        },
        reporter: {
          select: { username: true }
        }
      }
    });

    console.log(`📋 Post report updated by ${admin.username}:`, {
      reportId: updatedReport.id,
      newStatus: status,
      adminId: admin.id,
      isUpdate: isUpdate || false
    });

    return NextResponse.json({
      success: true,
      report: updatedReport
    });

  } catch (error) {
    console.error('❌ Error updating post report:', error);
    return NextResponse.json(
      { error: 'Failed to update report' },
      { status: 500 }
    );
  }
}