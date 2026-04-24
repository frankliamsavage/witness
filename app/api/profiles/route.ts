import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// Utility for random user selection - only from users with content
async function getRandomUser() {
  const count = await prisma.user.count({
    where: {
      OR: [
        { tagline: { not: null } },
        { bio: { not: null } },
        { legalName: { not: null } },
        { currentCity: { not: null } },
      ],
    },
  });
  if (count === 0) return null;
  const skip = Math.floor(Math.random() * count);
  return prisma.user.findFirst({ 
    where: {
      OR: [
        { tagline: { not: null } },
        { bio: { not: null } },
        { legalName: { not: null } },
        { currentCity: { not: null } },
      ],
    },
    skip 
  });
}

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user in our database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";
    const filter = searchParams.get("filter") as "all" | "friends" | "following" || "all";

    let whereClause: any = {
      // Only show users who have filled out some profile information
      OR: [
        { tagline: { not: null } },
        { bio: { not: null } },
        { legalName: { not: null } },
        { currentCity: { not: null } },
      ],
    };

    // Add search query if provided
    if (query) {
      whereClause = {
        AND: [
          {
            OR: [
              { username: { contains: query, mode: "insensitive" } },
              { legalName: { contains: query, mode: "insensitive" } },
              { tagline: { contains: query, mode: "insensitive" } },
            ],
          },
          whereClause,
        ],
      };
    }

    let users;

    if (filter === "friends") {
      // Debug: Check if there are any friendships for this user
      const friendships = await prisma.friendship.findMany({
        where: {
          OR: [
            { requesterId: dbUser.id },
            { addresseeId: dbUser.id }
          ]
        },
        include: {
          requester: { select: { username: true } },
          addressee: { select: { username: true } }
        }
      });
      
      console.log(`Friendships for user ${dbUser.username}:`, friendships);
      
      // Get friends only - users with ACCEPTED friendship status
      users = await prisma.user.findMany({
        where: {
          AND: [
            whereClause,
            {
              OR: [
                // Users who sent friend requests to current user and are accepted
                {
                  friendRequests: {
                    some: {
                      addresseeId: dbUser.id,
                      status: "ACCEPTED",
                    },
                  },
                },
                // Users who received friend requests from current user and are accepted
                {
                  friendRequestsReceived: {
                    some: {
                      requesterId: dbUser.id,
                      status: "ACCEPTED",
                    },
                  },
                },
              ],
            },
          ],
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      });
      
      console.log(`Friends found for ${dbUser.username}:`, users.length);
    } else if (filter === "following") {
      // Get users the current user is following
      users = await prisma.user.findMany({
        where: {
          AND: [
            whereClause,
            {
              followers: {
                some: {
                  followerId: dbUser.id,
                },
              },
            },
          ],
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      });
    } else {
      // Get all users (default)
      users = await prisma.user.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        take: 20,
      });
    }

    // Get random user only for "all" filter
    const randomUser = filter === "all" ? await getRandomUser() : null;

    return NextResponse.json({
      success: true,
      users,
      randomUser,
      filter,
      query,
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return NextResponse.json(
      { error: "Failed to fetch profiles" },
      { status: 500 }
    );
  }
}