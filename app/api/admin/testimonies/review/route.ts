import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(request: NextRequest) {
  try {
    const { id, action } = await request.json();

    if (!id || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({
        error: 'Invalid request. ID and action (approve/reject) required.'
      }, { status: 400 });
    }

    if (action === 'approve') {
      // Update testimony status to APPROVED
      await prisma.testimony.update({
        where: { id },
        data: { status: 'APPROVED' }
      });

      console.log(`✅ Testimony ${id} approved`);
      
      return NextResponse.json({
        success: true,
        message: 'Testimony approved and published'
      });

    } else if (action === 'reject') {
      // Delete the testimony
      await prisma.testimony.delete({
        where: { id }
      });

      console.log(`❌ Testimony ${id} rejected and deleted`);

      return NextResponse.json({
        success: true,
        message: 'Testimony rejected and deleted'
      });
    }

  } catch (error) {
    console.error('❌ Failed to process testimony:', error);
    
    return NextResponse.json({
      error: 'Failed to process testimony',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}