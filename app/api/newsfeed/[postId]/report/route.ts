import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const { postId } = params;
    const { reason, description, screenshot } = await request.json();

    if (!reason || reason.trim() === '') {
      return NextResponse.json({ error: 'Violation type is required' }, { status: 400 });
    }

    // Get user's database ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, username: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if post exists
    const post = await prisma.newsFeedPost.findUnique({
      where: { id: postId },
      select: { 
        id: true, 
        content: true, 
        authorId: true,
        author: {
          select: { username: true }
        }
      }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Create the report
    console.log('📝 Creating report with data:', {
      postId,
      reporterId: user.id,
      reason: reason.trim(),
      description: description?.trim() || null,
      hasScreenshot: !!screenshot,
      status: 'PENDING'
    });

    await prisma.postReport.create({
      data: {
        postId,
        reporterId: user.id,
        reason: reason.trim(),
        description: description?.trim() || null,
        screenshot: screenshot || null,
        status: 'PENDING'
      }
    });

    console.log('✅ Report created successfully');

    // Log the report for admin review (you can also send email notification here)
    console.log(`🚨 POST REPORT SUBMITTED:
      Post ID: ${postId}
      Post Content: ${post.content.substring(0, 100)}...
      Post Author: ${post.author.username}
      Reporter: ${user.username}
      Violation Type: ${reason}
      Description: ${description || 'None provided'}
      Screenshot: ${screenshot ? 'Included' : 'Not captured'}
      Timestamp: ${new Date().toISOString()}
    `);

    return NextResponse.json({ 
      success: true, 
      message: 'Report submitted successfully' 
    });

  } catch (error) {
    console.error('❌ Error submitting report:', error);
    console.error('❌ Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}