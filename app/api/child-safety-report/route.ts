import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { 
  submitChildSafetyReport, 
  ChildSafetyReportType,
  getPendingChildSafetyReports,
  resolveChildSafetyReport
} from '@/lib/childSafetyReporting';
import { prisma } from '@/lib/prisma';

/**
 * COPPA COMPLIANCE: CHILD SAFETY REPORTING API
 * 
 * Enhanced reporting system for child protection with:
 * - Specialized report categories (grooming, CSAM, etc.)
 * - Automatic prioritization and fast-track review
 * - Immediate admin alerts for critical reports
 * - Age-appropriate reporting interface
 */

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      type, 
      targetUserId, 
      targetContentId, 
      description, 
      evidence 
    } = await request.json();

    // Validate required fields
    if (!type || !description?.trim()) {
      return NextResponse.json({ 
        error: 'Report type and description are required' 
      }, { status: 400 });
    }

    // Validate report type
    if (!Object.values(ChildSafetyReportType).includes(type)) {
      return NextResponse.json({ 
        error: 'Invalid report type' 
      }, { status: 400 });
    }

    // Check user exists (age verification disabled - all users can report)
    const reporter = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { 
        isMinor: true,
        username: true
      }
    });

    if (!reporter) {
      return NextResponse.json({
        error: 'User not found'
      }, { status: 404 });
    }

    // Submit the child safety report
    const result = await submitChildSafetyReport({
      type,
      reporterId: userId,
      targetUserId,
      targetContentId,
      description,
      evidence: evidence || []
    });

    // Provide age-appropriate response
    const responseMessage = reporter.isMinor 
      ? "Thank you for reporting this. Our safety team will review this immediately. You're doing the right thing by speaking up."
      : "Your safety report has been submitted and will be reviewed according to our safety protocols.";

    return NextResponse.json({
      success: true,
      reportId: result.reportId,
      priority: result.priority,
      estimatedReviewTime: result.estimatedReviewTime,
      message: responseMessage
    });

  } catch (error) {
    console.error('🚨 Child safety report submission failed:', error);
    return NextResponse.json({
      error: 'Failed to submit report. Please try again or contact support.'
    }, { status: 500 });
  }
}

/**
 * GET - Retrieve safety reports (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin permissions
    const admin = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { isAdmin: true }
    });

    if (!admin?.isAdmin) {
      return NextResponse.json({ 
        error: 'Admin access required' 
      }, { status: 403 });
    }

    const url = new URL(request.url);
    const priority = url.searchParams.get('priority');
    const status = url.searchParams.get('status') || 'PENDING';

    // Get pending reports for review
    const reports = await prisma.childSafetyReport.findMany({
      where: {
        status,
        ...(priority && { priority })
      },
      include: {
        reporter: {
          select: {
            username: true,
            isMinor: true,
            dateOfBirth: true
          }
        },
        targetUser: {
          select: {
            username: true,
            isMinor: true,
            dateOfBirth: true
          }
        }
      },
      orderBy: [
        {
          priority: 'desc' // CRITICAL first
        },
        {
          createdAt: 'asc' // Oldest first within same priority
        }
      ]
    });

    return NextResponse.json({ reports });

  } catch (error) {
    console.error('Failed to fetch safety reports:', error);
    return NextResponse.json({
      error: 'Failed to fetch reports'
    }, { status: 500 });
  }
}

/**
 * PUT - Resolve a safety report (admin only)
 */
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      reportId, 
      action, 
      notes, 
      actionsTaken 
    } = await request.json();

    if (!reportId || !action || !notes?.trim()) {
      return NextResponse.json({
        error: 'Report ID, action, and notes are required'
      }, { status: 400 });
    }

    if (!['CONFIRMED', 'FALSE_POSITIVE', 'REQUIRES_FOLLOWUP'].includes(action)) {
      return NextResponse.json({
        error: 'Invalid action type'
      }, { status: 400 });
    }

    await resolveChildSafetyReport(
      reportId,
      userId,
      action,
      notes,
      actionsTaken || []
    );

    return NextResponse.json({
      success: true,
      message: `Report ${reportId} resolved as ${action}`
    });

  } catch (error) {
    console.error('Failed to resolve safety report:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to resolve report'
    }, { status: 500 });
  }
}