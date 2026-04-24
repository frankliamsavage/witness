import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count();
    const postCount = await prisma.newsFeedPost.count();
    const videoCount = await prisma.video.count();
    
    // Get recent posts
    const recentPosts = await prisma.newsFeedPost.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            clerkId: true
          }
        }
      }
    });

    // Get recent users
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        clerkId: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      status: 'Database connection successful',
      counts: {
        users: userCount,
        posts: postCount,
        videos: videoCount
      },
      recentPosts,
      recentUsers,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      status: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}