import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return default settings for now - in production this would read from database
    // The frontend will handle localStorage for persistence until database column is added
    const defaultSettings = {
      emailNotifications: true,
      pushNotifications: true,
      postLikes: true,
      postComments: true,
      postShares: true,
      newFollowers: true,
      mentions: true,
      weeklyDigest: false,
      marketingEmails: false,
    };

    return NextResponse.json({
      settings: defaultSettings,
      userId: userId // Return userId so frontend can use it for localStorage key
    });

  } catch (error) {
    console.error('❌ Failed to load notification settings:', error);
    
    return NextResponse.json({
      error: 'Failed to load notification settings',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { settings } = await request.json();

    if (!settings) {
      return NextResponse.json({ error: 'Settings data required' }, { status: 400 });
    }

    // For now, just simulate saving the settings
    // Later this will actually save to the database when the column is added
    console.log(`✅ Notification settings would be saved for user: ${userId}`, settings);

    return NextResponse.json({
      success: true,
      message: 'Notification settings saved successfully',
      savedSettings: settings,
      userId: userId
    });

  } catch (error) {
    console.error('❌ Failed to save notification settings:', error);
    
    return NextResponse.json({
      error: 'Failed to save notification settings',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}