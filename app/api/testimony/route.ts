import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Type declaration for global prisma
declare global {
  var prisma: PrismaClient | undefined;
}

// Use singleton pattern for Prisma client to avoid connection issues in production
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
  return NextResponse.json({ 
    message: "Testimony API endpoint is working - Updated Dec 1 2025",
    methods: ["GET", "POST"],
    timestamp: new Date().toISOString(),
    status: "active"
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Direct API testimony submission attempt');
    
    // Always handle as FormData since that's what we're sending
    const formData = await request.formData();
    const content = formData.get('content') as string;
    const authorName = formData.get('authorName') as string;
    const contactEmail = formData.get('contactEmail') as string;
    const userType = formData.get('userType') as string;

    console.log('📝 Form data received:', { 
      content: content ? 'Present' : 'Missing',
      authorName: authorName ? 'Present' : 'Missing',
      userType 
    });

    // Basic validation
    if (!content?.trim()) {
      return NextResponse.json({ error: "Please enter your testimony content." }, { status: 400 });
    }

    // Handle name logic properly - ensure anonymous submissions show as "Anonymous"
    let finalAuthorName = "Anonymous";
    if (userType === "registered") {
      // For registered users, use their actual username or Anonymous if not available
      finalAuthorName = authorName?.trim() || "Anonymous";
    } else {
      // For guests/anonymous, always use "Anonymous" (not "Anonymous Guest")
      finalAuthorName = "Anonymous";
    }

    // Log environment info
    console.log('🌍 Environment info:', {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
      DATABASE_URL_START: process.env.DATABASE_URL?.substring(0, 30)
    });

    // Connect to database
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Test table access
    const tableCount = await prisma.testimony.count();
    console.log(`📊 Testimony table accessible, current count: ${tableCount}`);

    // Create testimony
    const testimony = await prisma.testimony.create({
      data: {
        content: content.trim(),
        authorName: finalAuthorName,
        contactEmail: contactEmail?.trim() || null,
        isGuest: userType === "guest",
        status: userType === "guest" ? "PENDING" : "APPROVED",
        userId: null, // Simplified - not handling user auth in this direct route
      },
    });

    console.log(`✅ Testimony created successfully with ID: ${testimony.id}`);

    const message = userType === "guest" 
      ? "Thank you for your testimony! It will be reviewed by our moderation team before being published."
      : "Your testimony has been published successfully!";

    await prisma.$disconnect();

    return NextResponse.json({ 
      success: true, 
      message,
      testimonyId: testimony.id 
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('❌ Direct API submission error:', error);
    
    await prisma.$disconnect();

    return NextResponse.json({ 
      error: `Direct submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 3) // First 3 lines of stack
      } : null
    });
  }
}