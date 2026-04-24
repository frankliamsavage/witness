import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Type declaration for global prisma
declare global {
  var prisma: PrismaClient | undefined;
}

// Use singleton pattern for Prisma client
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export async function GET() {
  try {
    const testimonies = await prisma.testimony.findMany({
      where: {
        status: 'PENDING'
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        content: true,
        authorName: true,
        contactEmail: true,
        isGuest: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      testimonies,
      count: testimonies.length
    });

  } catch (error) {
    console.error('❌ Failed to load pending testimonies:', error);
    
    return NextResponse.json({
      error: 'Failed to load pending testimonies',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}