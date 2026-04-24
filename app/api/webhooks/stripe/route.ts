import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  // Check if Stripe is configured
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.warn('Stripe webhook called but not properly configured');
    return new NextResponse('Stripe not configured', { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-12-15.clover',
  });

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const body = await request.text();
  const headerList = await headers();
  const sig = headerList.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new NextResponse(`Webhook Error: ${err}`, { status: 400 });
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    try {
      // Log the donation to database
      await prisma.donation.create({
        data: {
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent as string || null,
          amount: session.amount_total || 0,
          currency: session.currency || 'usd',
          customerEmail: session.customer_details?.email || null,
          customerName: session.customer_details?.name || null,
          metadata: session.metadata || {},
          status: 'completed',
          createdAt: new Date(),
        }
      });
      
      console.log('✅ Donation logged successfully:', {
        sessionId: session.id,
        amount: session.amount_total,
        email: session.customer_details?.email,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Failed to log donation:', error);
      // Don't fail the webhook, just log the error
    }
  }

  return new NextResponse(null, { status: 200 });
}