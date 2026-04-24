import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'received';

    // Get user's database ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let messages;
    
    if (type === 'sent') {
      messages = await prisma.message.findMany({
        where: { senderId: user.id },
        include: {
          sender: { select: { username: true, profilePicture: true } },
          receiver: { select: { username: true, profilePicture: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      });
    } else {
      messages = await prisma.message.findMany({
        where: { receiverId: user.id },
        include: {
          sender: { select: { username: true, profilePicture: true } },
          receiver: { select: { username: true, profilePicture: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      });
    }

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { receiverUsername, subject, content } = await request.json();

    if (!receiverUsername || !content) {
      return NextResponse.json({ error: "Receiver and content are required" }, { status: 400 });
    }

    // Get sender's database ID
    const sender = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!sender) {
      return NextResponse.json({ error: "Sender not found" }, { status: 404 });
    }

    // Get receiver's database ID
    const receiver = await prisma.user.findUnique({
      where: { username: receiverUsername },
      select: { id: true }
    });

    if (!receiver) {
      return NextResponse.json({ error: "Receiver not found" }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        senderId: sender.id,
        receiverId: receiver.id,
        subject: subject || null,
        content,
      },
      include: {
        sender: { select: { username: true, profilePicture: true } },
        receiver: { select: { username: true, profilePicture: true } }
      }
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}