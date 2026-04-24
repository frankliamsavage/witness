import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username } = await request.json();

    if (!username || typeof username !== 'string' || username.trim().length < 3) {
      return NextResponse.json({ 
        error: "Username must be at least 3 characters long" 
      }, { status: 400 });
    }

    const cleanUsername = username.trim();

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(cleanUsername)) {
      return NextResponse.json({ 
        error: "Username can only contain letters, numbers, underscores, and hyphens" 
      }, { status: 400 });
    }

    if (cleanUsername.length > 30) {
      return NextResponse.json({ 
        error: "Username must be 30 characters or less" 
      }, { status: 400 });
    }

    // Find the user by clerkId or create if doesn't exist
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    // If user doesn't exist in database, create them with info from Clerk
    if (!user) {
      // Get user info from Clerk
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      const age = clerkUser.publicMetadata?.age as number;
      const dateOfBirth = clerkUser.publicMetadata?.dateOfBirth as string;

      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email,
          username: cleanUsername,
          age,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          ageVerified: true,
          ageVerificationDate: new Date(),
          hasCompletedInitialVerification: true,
          isMinor: false,
          requiresParentalConsent: false,
          canCreateProfile: true,
          profilePrivate: false,
          allowDirectMessages: true,
          showInSearch: true,
          requireFollowApproval: false,
          contentModerationLevel: 'STANDARD',
        }
      });

      console.log('✅ Created new user with username:', {
        userId: user.id,
        username: cleanUsername,
        email,
        timestamp: new Date().toISOString()
      });

      // Auto-follow NoBadi (MySpace Tom style - follow platform owner)
      try {
        const nobadiUser = await prisma.user.findUnique({
          where: { username: 'NoBadi' }
        });

        if (nobadiUser) {
          await prisma.follow.create({
            data: {
              followerId: user.id,
              followingId: nobadiUser.id
            }
          });
          console.log('✅ New user auto-follows NoBadi:', {
            newUserId: user.id,
            newUsername: cleanUsername,
            nobadiId: nobadiUser.id
          });
        }
      } catch (followError) {
        console.warn('Failed to auto-follow NoBadi for new user:', followError);
        // Don't fail the user creation if auto-follow fails
      }

      return NextResponse.json({ 
        success: true, 
        username: user.username,
        message: "Account created successfully!" 
      });
    }

    // Check if username is already taken
    const existingUser = await prisma.user.findUnique({
      where: { username: cleanUsername }
    });

    if (existingUser && existingUser.id !== user.id) {
      return NextResponse.json({ 
        error: "Username is already taken. Please choose a different one." 
      }, { status: 409 });
    }

    // Update the user with the new username
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { 
        username: cleanUsername
      }
    });

    // Auto-follow NoBadi if this is their first username setup
    if (!user.username) { // Only if they didn't have a username before
      try {
        const nobadiUser = await prisma.user.findUnique({
          where: { username: 'NoBadi' }
        });

        if (nobadiUser) {
          // Check if they're already following NoBadi
          const existingFollow = await prisma.follow.findUnique({
            where: {
              followerId_followingId: {
                followerId: user.id,
                followingId: nobadiUser.id
              }
            }
          });

          if (!existingFollow) {
            await prisma.follow.create({
              data: {
                followerId: user.id,
                followingId: nobadiUser.id
              }
            });
            console.log('✅ Existing user auto-follows NoBadi on first username setup:', {
              userId: user.id,
              username: cleanUsername,
              nobadiId: nobadiUser.id
            });
          }
        }
      } catch (followError) {
        console.warn('Failed to auto-follow NoBadi for existing user:', followError);
        // Don't fail the username setup if auto-follow fails
      }
    }

    console.log('✅ Username set for user:', {
      userId: user.id,
      username: cleanUsername,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      username: updatedUser.username,
      message: "Username set successfully!" 
    });

  } catch (error) {
    console.error('Username setup error:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json({ 
        error: "Username is already taken. Please choose a different one." 
      }, { status: 409 });
    }

    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}