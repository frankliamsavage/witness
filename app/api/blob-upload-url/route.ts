import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        console.log('🔗 Blob Upload URL: Generating token for:', pathname);
        
        // Validate file types
        if (!pathname.match(/\.(jpg|jpeg|png|gif|webp|mp4|mov|avi|mkv|wmv)$/i)) {
          throw new Error('Invalid file type. Only images and videos are allowed.');
        }

        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/png', 
            'image/gif',
            'image/webp',
            'video/mp4',
            'video/quicktime',
            'video/x-msvideo',
            'video/x-matroska',
            'video/x-ms-wmv'
          ],
          maximumSizeInBytes: 100 * 1024 * 1024, // 100MB limit
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('🔗 Blob Upload URL: Upload completed:', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('🔗 Blob Upload URL: Error:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}