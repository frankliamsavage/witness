/**
 * COPPA COMPLIANCE: ENHANCED CHILD SAFETY REPORTING
 * 
 * Specialized reporting categories and fast-track review
 * for child safety violations and inappropriate content
 */

import { prisma } from '@/lib/prisma';

export enum ChildSafetyReportType {
  GROOMING_ATTEMPT = 'GROOMING_ATTEMPT',
  INAPPROPRIATE_CONTACT = 'INAPPROPRIATE_CONTACT', 
  CSAM_SUSPECTED = 'CSAM_SUSPECTED',
  PERSONAL_INFO_REQUEST = 'PERSONAL_INFO_REQUEST',
  MEETING_SOLICITATION = 'MEETING_SOLICITATION',
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  BULLYING_HARASSMENT = 'BULLYING_HARASSMENT',
  PREDATORY_BEHAVIOR = 'PREDATORY_BEHAVIOR'
}

export enum ReportPriority {
  CRITICAL = 'CRITICAL', // CSAM, grooming, immediate danger
  HIGH = 'HIGH',         // Inappropriate contact, solicitation
  MEDIUM = 'MEDIUM',     // Bullying, harassment
  LOW = 'LOW'            // Minor policy violations
}

interface ChildSafetyReport {
  type: ChildSafetyReportType;
  reporterId: string;
  targetUserId?: string;
  targetContentId?: string;
  description: string;
  evidence?: string[];
}

/**
 * Determine report priority based on type and content
 */
export function calculateReportPriority(
  type: ChildSafetyReportType,
  description: string,
  reporterAge?: number
): ReportPriority {
  
  // Critical priority for the most dangerous situations
  if ([
    ChildSafetyReportType.CSAM_SUSPECTED,
    ChildSafetyReportType.GROOMING_ATTEMPT,
    ChildSafetyReportType.PREDATORY_BEHAVIOR
  ].includes(type)) {
    return ReportPriority.CRITICAL;
  }

  // High priority for contact attempts and solicitation
  if ([
    ChildSafetyReportType.INAPPROPRIATE_CONTACT,
    ChildSafetyReportType.MEETING_SOLICITATION,
    ChildSafetyReportType.PERSONAL_INFO_REQUEST
  ].includes(type)) {
    return ReportPriority.HIGH;
  }

  // Higher priority if reporter is very young
  if (reporterAge && reporterAge < 14) {
    return ReportPriority.HIGH;
  }

  // Check for urgency keywords in description
  const urgencyKeywords = [
    'immediately', 'urgent', 'emergency', 'scared', 'threatened',
    'won\'t stop', 'following me', 'found my address', 'calling me'
  ];

  if (urgencyKeywords.some(keyword => 
    description.toLowerCase().includes(keyword)
  )) {
    return ReportPriority.HIGH;
  }

  // Medium priority for bullying and harassment
  if ([
    ChildSafetyReportType.BULLYING_HARASSMENT,
    ChildSafetyReportType.INAPPROPRIATE_CONTENT
  ].includes(type)) {
    return ReportPriority.MEDIUM;
  }

  return ReportPriority.LOW;
}

/**
 * Submit a child safety report with automatic prioritization
 */
export async function submitChildSafetyReport(
  report: ChildSafetyReport
): Promise<{ reportId: string; priority: ReportPriority; estimatedReviewTime: string }> {
  
  try {
    // Get reporter information for context
    const reporter = await prisma.user.findUnique({
      where: { clerkId: report.reporterId },
      select: {
        id: true,
        dateOfBirth: true,
        isMinor: true,
        username: true
      }
    });

    if (!reporter) {
      throw new Error('Reporter not found');
    }

    // Calculate reporter age for priority assessment
    const reporterAge = reporter.dateOfBirth 
      ? new Date().getFullYear() - new Date(reporter.dateOfBirth).getFullYear()
      : undefined;

    // Determine priority
    const priority = calculateReportPriority(report.type, report.description, reporterAge);

    // Create the safety report
    const safetyReport = await prisma.childSafetyReport.create({
      data: {
        type: report.type,
        priority,
        reporterId: reporter.id,
        targetUserId: report.targetUserId,
        targetContentId: report.targetContentId,
        description: report.description,
        evidence: report.evidence || [],
        status: 'PENDING',
        createdAt: new Date(),
        urgentAction: priority === ReportPriority.CRITICAL
      }
    });

    // Create immediate admin alert for high/critical reports
    if ([ReportPriority.CRITICAL, ReportPriority.HIGH].includes(priority)) {
      await prisma.adminAlert.create({
        data: {
          type: 'CHILD_SAFETY_REPORT',
          priority: priority,
          description: `${report.type}: ${report.description.substring(0, 100)}...`,
          relatedUserId: report.reporterId,
          targetUserId: report.targetUserId,
          status: 'PENDING'
        }
      });

      // For critical reports, also send immediate notifications
      if (priority === ReportPriority.CRITICAL) {
        await sendCriticalAlertToAdmins(safetyReport.id, report.type, report.description);
      }
    }

    // Estimate review time based on priority
    const estimatedReviewTime = {
      [ReportPriority.CRITICAL]: '15 minutes',
      [ReportPriority.HIGH]: '2 hours', 
      [ReportPriority.MEDIUM]: '24 hours',
      [ReportPriority.LOW]: '72 hours'
    }[priority];

    // Log the report for audit purposes
    console.log(`🚨 CHILD SAFETY REPORT: ${report.type} (${priority}) from ${reporter.username} - Report ID: ${safetyReport.id}`);

    return {
      reportId: safetyReport.id,
      priority,
      estimatedReviewTime
    };

  } catch (error) {
    console.error('Failed to submit child safety report:', error);
    throw new Error('Failed to submit report');
  }
}

/**
 * Send critical alerts to all online admins
 */
async function sendCriticalAlertToAdmins(
  reportId: string, 
  type: ChildSafetyReportType, 
  description: string
): Promise<void> {
  try {
    // Get all admin users
    const admins = await prisma.user.findMany({
      where: { isAdmin: true },
      select: { id: true, clerkId: true, username: true }
    });

    // Create notifications for all admins
    const notifications = admins.map(admin => ({
      userId: admin.id,
      type: 'SYSTEM_UPDATE' as const,
      title: `🚨 CRITICAL CHILD SAFETY ALERT`,
      message: `IMMEDIATE ACTION REQUIRED: ${type} reported. Report ID: ${reportId}. Review immediately in admin dashboard.`,
      isRead: false,
      actionUrl: `/dashboard/admin/child-safety-reports/${reportId}`
    }));

    await prisma.notification.createMany({
      data: notifications
    });

    console.log(`🚨 CRITICAL ALERT sent to ${admins.length} admins for report ${reportId}`);

  } catch (error) {
    console.error('Failed to send critical alerts to admins:', error);
  }
}

/**
 * Get pending child safety reports for admin review
 */
export async function getPendingChildSafetyReports(
  priority?: ReportPriority
) {
  const where = priority 
    ? { status: 'PENDING', priority }
    : { status: 'PENDING' };

  return await prisma.childSafetyReport.findMany({
    where,
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
      { priority: 'desc' }, // CRITICAL > HIGH > MEDIUM > LOW
      { createdAt: 'asc' }
    ]
  });
}

/**
 * Process and resolve a child safety report
 */
export async function resolveChildSafetyReport(
  reportId: string,
  adminUserId: string,
  action: 'CONFIRMED' | 'FALSE_POSITIVE' | 'REQUIRES_FOLLOWUP',
  notes: string,
  actionsTaken?: string[]
): Promise<void> {
  
  try {
    const admin = await prisma.user.findUnique({
      where: { clerkId: adminUserId },
      select: { isAdmin: true, username: true }
    });

    if (!admin?.isAdmin) {
      throw new Error('Admin permissions required');
    }

    await prisma.childSafetyReport.update({
      where: { id: reportId },
      data: {
        status: 'RESOLVED',
        resolution: action,
        reviewedBy: admin.username,
        reviewedAt: new Date(),
        reviewNotes: notes,
        actionsTaken: actionsTaken || []
      }
    });

    // If confirmed violation, take additional actions
    if (action === 'CONFIRMED') {
      await handleConfirmedSafetyViolation(reportId, actionsTaken || []);
    }

    console.log(`✅ Child safety report ${reportId} resolved by ${admin.username}: ${action}`);

  } catch (error) {
    console.error('Failed to resolve child safety report:', error);
    throw error;
  }
}

/**
 * Handle confirmed safety violations with appropriate actions
 */
async function handleConfirmedSafetyViolation(
  reportId: string,
  actionsTaken: string[]
): Promise<void> {
  
  const report = await prisma.childSafetyReport.findUnique({
    where: { id: reportId },
    include: {
      targetUser: true
    }
  });

  if (!report || !report.targetUser) return;

  // Log the violation for future reference
  await prisma.safetyViolation.create({
    data: {
      userId: report.targetUser.id,
      violationType: report.type,
      description: report.description,
      severity: report.priority,
      actionsTaken,
      reportId
    }
  });

  console.log(`📝 Safety violation logged for user ${report.targetUser.username}`);
}