import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current user's ID to exclude from results
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all users except the current user
    const users = await prisma.user.findMany({
      where: {
        id: { not: currentUser.id },
        username: { not: null } // Only users with usernames
      },
      select: {
        id: true,
        username: true,
        profilePicture: true,
        isVerified: true,
        legalName: true,
        currentCity: true,
        currentState: true,
        bio: true
      },
      orderBy: [
        { isVerified: 'desc' }, // Verified users first
        { username: 'asc' }     // Then alphabetically
      ]
    });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}