import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  // Check if Stripe is configured
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Donation system not configured. Please contact support.' },
      { status: 503 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-12-15.clover',
  });

  try {
    const { amount } = await request.json();
    
    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: 'Invalid donation amount' },
        { status: 400 }
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Gift to The Witness Project',
              description: 'A voluntary gift with love and no expectations of anything in return',
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/support/thank-you?amount=${amount}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/support`,
      metadata: {
        type: 'gift_donation',
        description: 'Voluntary gift to Witness Project',
      },
      payment_intent_data: {
        metadata: {
          type: 'gift_donation',
          project: 'witness_project'
        }
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating donation session:', error);
    return NextResponse.json(
      { error: 'Failed to create donation session' },
      { status: 500 }
    );
  }
}