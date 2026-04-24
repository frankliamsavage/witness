import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json([], { status: 401 });

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { videos: true },
    });

    return NextResponse.json(user?.videos || []);
  } catch (err) {
    console.error("Error loading videos:", err);
    return NextResponse.json([], { status: 500 });
  }
}
