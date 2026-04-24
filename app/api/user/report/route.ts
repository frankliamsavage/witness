import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reportedUserId, reportedUsername, category, reason, description } = await request.json();

    // Validate required fields
    if (!category || !reason || !description) {
      return NextResponse.json(
        { error: 'Category, reason, and description are required' },
        { status: 400 }
      );
    }

    // Find reported user by ID or username
    let targetUser;
    if (reportedUserId) {
      targetUser = await prisma.user.findUnique({
        where: { id: reportedUserId },
        select: { id: true, username: true }
      });
    } else if (reportedUsername) {
      targetUser = await prisma.user.findFirst({
        where: { 
          username: { 
            equals: reportedUsername.replace('@', ''), 
            mode: 'insensitive' 
          } 
        },
        select: { id: true, username: true }
      });
    }

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is trying to report themselves
    const reporter = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!reporter) {
      return NextResponse.json({ error: 'Reporter not found' }, { status: 404 });
    }

    if (reporter.id === targetUser.id) {
      return NextResponse.json(
        { error: 'You cannot report yourself' },
        { status: 400 }
      );
    }

    // Check for duplicate reports within the last 24 hours
    const recentReport = await prisma.userReport.findFirst({
      where: {
        reporterId: reporter.id,
        reportedUserId: targetUser.id,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
        }
      }
    });

    if (recentReport) {
      return NextResponse.json(
        { error: 'You have already reported this user in the last 24 hours' },
        { status: 400 }
      );
    }

    // Create the report
    const report = await prisma.userReport.create({
      data: {
        reportedUserId: targetUser.id,
        reporterId: reporter.id,
        category,
        reason: reason.trim(),
        description: description.trim(),
        status: 'PENDING'
      },
      include: {
        reportedUser: {
          select: { username: true, email: true }
        },
        reporter: {
          select: { username: true, email: true }
        }
      }
    });

    console.log(`📋 New user report submitted:`, {
      reportId: report.id,
      reporter: report.reporter.username,
      reported: report.reportedUser.username,
      category: report.category,
      reason: report.reason
    });

    return NextResponse.json({
      success: true,
      reportId: report.id,
      message: 'Report submitted successfully'
    });

  } catch (error) {
    console.error('❌ Error creating user report:', error);
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { isAdmin: true, id: true }
    });

    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'PENDING';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Get reports with pagination
    const reports = await prisma.userReport.findMany({
      where: status !== 'ALL' ? { status: status as 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED' } : undefined,
      include: {
        reportedUser: {
          select: {
            id: true,
            username: true,
            email: true,
            profilePicture: true,
            isVerified: true
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
      },
      skip: offset,
      take: limit
    });

    const totalReports = await prisma.userReport.count({
      where: status !== 'ALL' ? { status: status as 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED' } : undefined
    });

    return NextResponse.json({
      reports,
      pagination: {
        page,
        limit,
        total: totalReports,
        pages: Math.ceil(totalReports / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error fetching user reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}