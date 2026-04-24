import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

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
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get pending testimonies
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
        createdAt: true,
        status: true
      }
    });

    return NextResponse.json({ 
      testimonies,
      count: testimonies.length 
    });

  } catch (error) {
    console.error('Admin testimonies GET error:', error);
    return NextResponse.json({ 
      error: "Failed to fetch testimonies" 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { testimonyId, action } = await request.json();

    if (!testimonyId || !action) {
      return NextResponse.json({ 
        error: "Missing testimonyId or action" 
      }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ 
        error: "Invalid action. Must be 'approve' or 'reject'" 
      }, { status: 400 });
    }

    // Update testimony status
    const updatedTestimony = await prisma.testimony.update({
      where: {
        id: testimonyId
      },
      data: {
        status: action === 'approve' ? 'APPROVED' : 'REJECTED',
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ 
      success: true,
      message: action === 'approve' 
        ? "Testimony approved and published successfully" 
        : "Testimony rejected successfully",
      testimony: {
        id: updatedTestimony.id,
        status: updatedTestimony.status
      }
    });

  } catch (error) {
    console.error('Admin testimonies POST error:', error);
    return NextResponse.json({ 
      error: "Failed to process testimony" 
    }, { status: 500 });
  }
}