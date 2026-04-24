import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { username: true } } },
    });
    return NextResponse.json(questions);
  } catch (err) {
    console.error("Error loading questions:", err);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 401 });

  const body = await req.json();
  const { question } = body;
  if (!question) return NextResponse.json({ error: "Empty question" }, { status: 400 });

  try {
    // Find or create user with Clerk username
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          username: user.username || user.emailAddresses[0]?.emailAddress || `user_${userId.slice(0, 8)}`,
        },
      });
    }

    // Create question
    const newQuestion = await prisma.question.create({
      data: {
        content: question,
        userId: dbUser.id,
      },
      include: { user: { select: { username: true } } },
    });
    return NextResponse.json(newQuestion);
  } catch (err) {
    console.error("Error saving question:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
