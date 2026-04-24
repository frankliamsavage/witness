import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed file types for ID verification
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'application/pdf'
];

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('document') as File;
    const type = formData.get('type') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No document provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and PDF files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Create secure filename with hash for integrity
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generate file hash for integrity verification
    const fileHash = createHash('sha256').update(buffer).digest('hex');
    
    // Create secure filename: userId_timestamp_hash.extension
    const fileExtension = file.name.split('.').pop();
    const timestamp = Date.now();
    const secureFilename = `${userId}_${timestamp}_${fileHash.substring(0, 16)}.${fileExtension}`;
    
    // For Vercel deployment, we'll store the base64 encoded file data temporarily
    // In production, this should be moved to cloud storage (AWS S3, etc.)
    const base64Data = buffer.toString('base64');
    const secureUrl = `data:${file.type};base64,${base64Data}`;
    
    // Log security event
    console.log(`Secure document processed - User: ${userId}, File: ${secureFilename}, Hash: ${fileHash}, Type: ${type}`);
    
    return NextResponse.json({
      success: true,
      url: secureUrl,
      hash: fileHash,
      filename: secureFilename
    });
    
  } catch (error) {
    console.error('Secure document upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload document securely' },
      { status: 500 }
    );
  }
}