import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Secure document access endpoint for administrators
 * Handle base64 encoded documents stored in database
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // TODO: Check if user is admin (you may want to implement this check)
    
    const { searchParams } = new URL(request.url);
    const documentUrl = searchParams.get('url');
    
    if (!documentUrl) {
      return new NextResponse('Document URL required', { status: 400 });
    }

    // Handle base64 data URLs
    if (documentUrl.startsWith('data:')) {
      const [header, base64Data] = documentUrl.split(',');
      const mimeType = header.match(/data:([^;]+)/)?.[1] || 'application/octet-stream';
      
      // Convert base64 to buffer
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Log access for security audit
      console.log(`🔐 Admin document access - User: ${userId}, Type: ${mimeType}`);
      
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          'Content-Type': mimeType,
          'Content-Disposition': 'inline',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY'
        }
      });
    }
    
    return new NextResponse('Invalid document format', { status: 400 });
    
  } catch (error) {
    console.error('Secure document access error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}