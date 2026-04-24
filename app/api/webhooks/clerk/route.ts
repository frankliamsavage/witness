import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { prisma } from '@/lib/prisma';

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env.local');
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
  console.log('Webhook body:', body);

  // Handle user creation for COPPA compliance
  if (eventType === 'user.created') {
    try {
      const clerkId = evt.data.id;
      const email = evt.data.email_addresses[0]?.email_address;
      
      // Don't automatically create user in database anymore
      // New users will be created when they complete username setup
      // This prevents "Unknown User" issues and forces username completion
      
      console.log('✅ New user registered with Clerk:', {
        clerkId,
        email,
        willNeedUsernameSetup: true,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Error creating user:', error);
      return new Response('Error creating user', { status: 500 });
    }
  }

  // Handle user deletion for COPPA compliance
  if (eventType === 'user.deleted') {
    try {
      const clerkId = evt.data.id;
      
      // Delete user and all associated data for COPPA compliance
      await prisma.user.delete({
        where: { clerkId }
      });

      console.log('🗑️ COPPA-compliant user deletion completed:', clerkId);

    } catch (error) {
      console.error('❌ Error deleting user:', error);
    }
  }

  return NextResponse.json({ received: true });
}

export async function GET() {
  return NextResponse.json({ 
    message: "COPPA-compliant Clerk webhook endpoint",
    status: "active",
    compliance: "COPPA-ready"
  });
}