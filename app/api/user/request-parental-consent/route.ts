import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

// Initialize Resend only if API key is available
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { parentEmail, parentName, relationship } = await request.json();

    if (!parentEmail || !parentName || !relationship) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.requiresParentalConsent) {
      return NextResponse.json({ error: 'Parental consent not required for this user' }, { status: 400 });
    }

    // Generate a unique consent token
    const consentToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days to respond

    // Create parental consent record
    const consentRequest = await prisma.parentalConsent.create({
      data: {
        userId: user.id,
        parentEmail,
        parentName,
        relationship,
        consentToken,
        expiresAt,
        status: 'PENDING'
      }
    });

    // Update user with parental contact info
    await prisma.user.update({
      where: { id: user.id },
      data: {
        parentalContactEmail: parentEmail
      }
    });

    // Send consent email to parent
    const consentUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://witnessproject.net'}/parental-consent/${consentToken}`;
    
    if (resend) {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'notifications@witnessproject.net',
        to: parentEmail,
        subject: 'Parental Consent Required - Witness Project',
        html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Witness Project</h1>
            <h2 style="color: white; margin: 10px 0 0 0; font-weight: normal;">Parental Consent Required</h2>
          </div>
          
          <div style="padding: 30px; background: white;">
            <p style="font-size: 16px; line-height: 1.6;">Dear ${parentName},</p>
            
            <p style="font-size: 16px; line-height: 1.6;">
              Your child has requested to create an account on the Witness Project platform. 
              As they are under 13 years old, federal COPPA laws require your verified consent before we can create their account.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #495057;">Account Details:</h3>
              <ul style="list-style: none; padding: 0;">
                <li style="margin: 8px 0;"><strong>Child's Username:</strong> ${user.username || 'Not set'}</li>
                <li style="margin: 8px 0;"><strong>Relationship:</strong> ${relationship}</li>
                <li style="margin: 8px 0;"><strong>Request Date:</strong> ${new Date().toLocaleDateString()}</li>
              </ul>
            </div>
            
            <h3 style="color: #495057;">What We Protect:</h3>
            <ul style="line-height: 1.8;">
              <li>Your child's personal information is never shared</li>
              <li>Enhanced safety controls and content filtering</li>
              <li>Restricted communication features</li>
              <li>Parental oversight and control options</li>
              <li>Automatic account transition to adult status at age 18</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${consentUrl}" 
                 style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Review & Give Consent
              </a>
            </div>
            
            <p style="font-size: 14px; color: #6c757d; border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 30px;">
              This consent link will expire in 7 days. If you did not request this or have concerns, 
              please contact us immediately at <a href="mailto:support@witnessproject.net">support@witnessproject.net</a>
            </p>
          </div>
        </div>
      `
      });
    } else {
      console.warn('Resend API key not configured - email not sent');
    }

    return NextResponse.json({
      success: true,
      message: 'Parental consent request sent successfully',
      consentId: consentRequest.id
    });
    
  } catch (error) {
    console.error('Parental consent request error:', error);
    return NextResponse.json(
      { error: 'Failed to send parental consent request' }, 
      { status: 500 }
    );
  }
}