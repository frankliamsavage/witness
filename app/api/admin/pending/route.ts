import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Type declaration for global prisma
declare global {
  var prisma: PrismaClient | undefined;
}

// Use singleton pattern for Prisma client
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export async function GET() {
  try {
    // Get pending testimonies (status = PENDING)
    const pendingTestimonies = await prisma.testimony.count({
      where: {
        status: 'PENDING'
      }
    });

    // Get pending post reports
    const pendingPostReports = await prisma.postReport.count({
      where: {
        status: 'PENDING'
      }
    });

    // Get pending user reports  
    const pendingUserReports = await prisma.userReport.count({
      where: {
        status: 'PENDING'
      }
    });

    // Total reported content includes both post and user reports
    const reportedContent = pendingPostReports + pendingUserReports;

    // Get recent posts that might need review (posted in last 24 hours)
    const recentPosts = await prisma.post.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      }
    });

    const totalPending = pendingTestimonies + reportedContent + recentPosts;

    return NextResponse.json({
      pendingTestimonies,
      pendingPosts: recentPosts,
      reportedContent,
      pendingPostReports,
      totalPending
    });

  } catch (error) {
    console.error('❌ Failed to load pending content:', error);
    
    return NextResponse.json({
      error: 'Failed to load pending content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}