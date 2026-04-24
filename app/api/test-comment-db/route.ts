import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log('🔍 Testing database models...');
    
    // Test if PostComment table exists by trying to count records
    const commentCount = await prisma.postComment.count();
    console.log('✅ PostComment table exists, count:', commentCount);
    
    // Test if we can find a user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" });
    }
    
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });
    console.log('✅ User found:', user?.id, user?.username);
    
    // Test if we can find a post
    const firstPost = await prisma.newsFeedPost.findFirst();
    console.log('✅ First post found:', firstPost?.id, firstPost?.content?.substring(0, 50));
    
    return NextResponse.json({ 
      success: true, 
      commentCount,
      user: user?.username,
      hasPost: !!firstPost 
    });
    
  } catch (error) {
    console.error('❌ Database test error:', error);
    return NextResponse.json({ 
      error: "Database test failed", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}