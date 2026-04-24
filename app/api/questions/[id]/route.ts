import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check if user is a witness (staff)
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { isWitness: true }
  });

  if (!user?.isWitness) {
    return NextResponse.json({ error: "Staff access required" }, { status: 403 });
  }

  const { answer } = await req.json();
  if (!answer) return NextResponse.json({ error: "Empty answer" }, { status: 400 });

  try {
    const { id } = await params;  // <- await params in Next.js 15
    const updated = await prisma.question.update({
      where: { id },
      data: { answer: answer.trim() },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error saving answer:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check if user is a witness (staff)
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { isWitness: true }
  });

  if (!user?.isWitness) {
    return NextResponse.json({ error: "Staff access required" }, { status: 403 });
  }

  try {
    const { id } = await params;
    await prisma.question.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting question:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}