"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function submitTestimonyAction(formData: FormData) {
  const content = formData.get("content") as string;
  const authorName = formData.get("authorName") as string;
  const contactEmail = formData.get("contactEmail") as string;
  const userType = formData.get("userType") as string;

  console.log("Testimony submission data:", { content, authorName, contactEmail, userType });

  // Basic validation
  if (!content?.trim()) {
    console.log("Missing or empty content field");
    return { error: "Please enter your testimony content." };
  }

  if (content.trim().length < 10) {
    console.log("Content too short");
    return { error: "Please write at least 10 characters for your testimony." };
  }

  // For guest users, authorName is required
  if (userType === "guest" && !authorName?.trim()) {
    console.log("Missing author name for guest user");
    return { error: "Please enter your name for guest submissions." };
  }

  try {
    // Log environment for debugging
    console.log("Environment check:", {
      nodeEnv: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20)
    });

    // Test database connection first
    try {
      await prisma.$connect();
      console.log("Database connection successful");
      
      // Test if we can actually query the testimony table
      await prisma.testimony.findFirst();
      console.log("Testimony table accessible");
    } catch (dbErr) {
      console.error("Database connection or table access failed:", dbErr);
      return { error: "Database connection failed. Please contact support." };
    }

    const { userId } = await auth();
    const isGuest = userType === "guest" || !userId;
    
    console.log("User auth data:", { userId, isGuest, userType });

    // For registered users, get their username if no display name provided
    let finalAuthorName = authorName?.trim();
    if (!isGuest && !finalAuthorName) {
      try {
        // Get user from database to use their username
        const user = await prisma.user.findUnique({
          where: { clerkId: userId! },
          select: { username: true }
        });
        finalAuthorName = user?.username || "Anonymous User";
        console.log("Retrieved username from database:", finalAuthorName);
      } catch (userErr) {
        console.error("Error fetching user:", userErr);
        finalAuthorName = "Anonymous User";
      }
    }

    // For registered users, testimonies are auto-approved
    // For guests, testimonies need moderation
    const status = isGuest ? "PENDING" as const : "APPROVED" as const;

    const testimonyData = {
      content: content.trim(),
      authorName: finalAuthorName || "Anonymous",
      contactEmail: contactEmail?.trim() || null,
      isGuest,
      status,
      userId: isGuest ? null : userId,
    };

    console.log("About to create testimony with data:", testimonyData);

    const testimony = await prisma.testimony.create({
      data: testimonyData,
    });

    console.log("Testimony created successfully:", testimony.id);

    if (isGuest) {
      return { 
        success: true, 
        message: "Thank you for your testimony! It will be reviewed by our moderation team before being published." 
      };
    } else {
      return { 
        success: true, 
        message: "Your testimony has been published successfully!" 
      };
    }
  } catch (err) {
    console.error("Testimony submission error:", err);
    // Provide more specific error messages
    if (err instanceof Error) {
      if (err.message.includes('connect') || err.message.includes('ECONNREFUSED')) {
        return { error: "Database connection failed. Please try again in a moment." };
      } else if (err.message.includes('Testimony') || 'code' in err && err.code === 'P2021') {
        return { error: "Database table not found. Please contact support." };
      } else if (err.message.includes('timeout')) {
        return { error: "Request timed out. Please try again." };
      } else if (err.message.includes('Environment variable not found')) {
        return { error: "Database configuration error. Please contact support." };
      } else {
        return { error: `Submission failed: ${err.message}. Please try again or contact support.` };
      }
    }
    
    return { error: "An unexpected error occurred. Please try again or contact support." };
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectErr) {
      console.error("Error disconnecting from database:", disconnectErr);
    }
  }
}

export async function getApprovedTestimoniesAction() {
  try {
    const testimonies = await prisma.testimony.findMany({
      where: {
        status: "APPROVED"
      },
      include: {
        user: {
          select: {
            username: true,
            isVerified: true,
            isWitness: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 50, // Limit to recent 50 testimonies
    });

    return { success: true, testimonies };
  } catch (err) {
    console.error("Error fetching testimonies:", err);
    return { error: "Failed to load testimonies" };
  }
}

