import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's profile picture from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { profilePicture: true }
    });

    return NextResponse.json({ 
      profilePicture: user?.profilePicture || null 
    });

  } catch (error) {
    console.error("Get profile picture error:", error);
    return NextResponse.json(
      { error: "Failed to get profile picture" },
      { status: 500 }
    );
  }
}