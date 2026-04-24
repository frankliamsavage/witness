import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

/**
 * Submit a date of birth change request
 * This creates an internal request that can be reviewed by administrators
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔐 DOB Change Request - Starting processing...');
    
    const user = await currentUser();
    
    if (!user) {
      console.log('❌ DOB Change Request - No user authenticated');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    console.log('✅ DOB Change Request - User authenticated:', user.id);

    const body = await request.json();
    console.log('📋 DOB Change Request - Request body keys:', Object.keys(body));
    
    const { 
      reason, 
      currentDOB, 
      requestedDOB, 
      idDocumentUrl, 
      idDocumentType, 
      idDocumentHash,
      userAgent 
    } = body;

    console.log('📋 DOB Change Request - Validation check:', {
      hasReason: !!reason,
      hasCurrentDOB: !!currentDOB,
      hasIdDocumentUrl: !!idDocumentUrl,
      hasIdDocumentType: !!idDocumentType,
      reasonLength: reason?.length,
      documentType: idDocumentType
    });

    if (!reason || !currentDOB || !idDocumentUrl || !idDocumentType) {
      console.log('❌ DOB Change Request - Validation failed');
      return NextResponse.json(
        { error: 'Reason, current DOB, and valid ID document are required for verification' },
        { status: 400 }
      );
    }

    console.log('✅ DOB Change Request - Validation passed, looking up user...');

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      select: { id: true, email: true, username: true, dateOfBirth: true }
    });

    if (!dbUser) {
      console.log('❌ DOB Change Request - User not found in database');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('✅ DOB Change Request - Database user found:', dbUser.username);

    // Get client IP for security audit
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';

    // Create security audit log
    const auditLog = JSON.stringify({
      timestamp: new Date().toISOString(),
      action: 'dob_change_request_submitted',
      userId: dbUser.id,
      ipAddress: clientIP,
      userAgent: userAgent || 'unknown',
      documentType: idDocumentType,
      hasDocument: !!idDocumentUrl
    });

    // Create the change request with ID verification fields
    console.log('📝 DOB Change Request - Creating database record...');
    const changeRequest = await prisma.dobChangeRequest.create({
      data: {
        userId: dbUser.id,
        currentDOB: new Date(currentDOB),
        requestedDOB: requestedDOB ? new Date(requestedDOB) : null,
        reason: reason,
        status: 'PENDING',
        
        // ID Verification Security Fields
        idDocumentUrl: idDocumentUrl,
        idDocumentType: idDocumentType,
        idDocumentHash: idDocumentHash,
        idVerified: false, // Will be set to true by admin after verification
        
        // Security & Audit Trail
        ipAddress: clientIP,
        userAgent: userAgent || null,
        auditLog: auditLog,
        
        requestedAt: new Date(),
      }
    });

    console.log('✅ DOB Change Request - Database record created successfully:', changeRequest.id);

    console.log('🔐 Secure DOB Change Request Created:', {
      requestId: changeRequest.id,
      userId: dbUser.id,
      username: dbUser.username,
      documentType: idDocumentType,
      ipAddress: clientIP,
      reason: reason.substring(0, 100)
    });

    return NextResponse.json({ 
      success: true,
      message: '🔐 Your secure date of birth change request has been submitted with ID verification. Our security team will review your government-issued ID and respond within 3-5 business days.',
      requestId: changeRequest.id
    });

  } catch (error) {
    console.error('DOB change request error:', error);
    return NextResponse.json(
      { error: 'Failed to submit change request' },
      { status: 500 }
    );
  }
}