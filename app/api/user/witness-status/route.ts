import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ isWitness: false }, { status: 401 });
    }

    // Check if user exists and has witness status
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { isWitness: true }
    });

    return NextResponse.json({ 
      isWitness: user?.isWitness || false 
    });
  } catch (error) {
    console.error("Error checking witness status:", error);
    return NextResponse.json({ isWitness: false }, { status: 500 });
  }
}