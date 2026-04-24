"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function voteOnTestimonyAction(
  testimonyId: string,
  voteType: 'UPVOTE' | 'DOWNVOTE'
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { error: "You must be signed in to vote on testimonies." };
    }

    console.log('🗳️ Enhanced voting attempt:', { testimonyId, voteType, userId: userId.substring(0, 8) + '...' });

    // First verify the testimony exists and is approved
    const testimony = await prisma.testimony.findUnique({
      where: { id: testimonyId },
      select: { id: true, status: true, upvotes: true, downvotes: true }
    });

    if (!testimony) {
      console.error('❌ Testimony not found:', testimonyId);
      return { error: "Testimony not found." };
    }

    if (testimony.status !== 'APPROVED') {
      console.error('❌ Testimony not approved:', testimony.status);
      return { error: "This testimony is not available for voting." };
    }

    console.log('✅ Testimony verified:', { id: testimonyId.substring(0, 8) + '...', status: testimony.status });

    // Ensure user exists in database and get their database ID
    let dbUserId: string;
    try {
      const user = await prisma.user.upsert({
        where: { clerkId: userId },
        create: {
          clerkId: userId,
          username: `user_${userId.substring(0, 8)}`,
        },
        update: {},
      });
      dbUserId = user.id;
      console.log('✅ User ensured in database:', { clerkId: userId.substring(0, 8) + '...', dbId: dbUserId.substring(0, 8) + '...' });
    } catch (userError) {
      console.error('❌ User creation failed:', userError);
      return { error: "Account setup failed. Please try signing out and back in." };
    }

    // Use Prisma client methods instead of raw SQL for better error handling
    const result = await prisma.$transaction(async (tx) => {
      try {
        // Check for existing vote
        const existingVote = await tx.testimonyVote.findUnique({
          where: {
            testimonyId_userId: {
              testimonyId: testimonyId,
              userId: dbUserId
            }
          }
        });

        if (existingVote) {
          if (existingVote.voteType === voteType) {
            // Remove the existing vote (toggle off)
            await tx.testimonyVote.delete({
              where: {
                testimonyId_userId: {
                  testimonyId: testimonyId,
                  userId: dbUserId
                }
              }
            });

            // Update testimony counter
            if (voteType === 'UPVOTE') {
              await tx.testimony.update({
                where: { id: testimonyId },
                data: { upvotes: Math.max((testimony.upvotes || 0) - 1, 0) }
              });
            } else {
              await tx.testimony.update({
                where: { id: testimonyId },
                data: { downvotes: Math.max((testimony.downvotes || 0) - 1, 0) }
              });
            }

            console.log('✅ Vote removed (toggled off)');
            return { action: 'removed', voteType };
          } else {
            // Change existing vote
            await tx.testimonyVote.update({
              where: {
                testimonyId_userId: {
                  testimonyId: testimonyId,
                  userId: dbUserId
                }
              },
              data: { voteType: voteType }
            });

            // Update testimony counters (subtract old, add new)
            if (existingVote.voteType === 'UPVOTE' && voteType === 'DOWNVOTE') {
              await tx.testimony.update({
                where: { id: testimonyId },
                data: {
                  upvotes: Math.max((testimony.upvotes || 0) - 1, 0),
                  downvotes: (testimony.downvotes || 0) + 1
                }
              });
            } else if (existingVote.voteType === 'DOWNVOTE' && voteType === 'UPVOTE') {
              await tx.testimony.update({
                where: { id: testimonyId },
                data: {
                  downvotes: Math.max((testimony.downvotes || 0) - 1, 0),
                  upvotes: (testimony.upvotes || 0) + 1
                }
              });
            }

            console.log('✅ Vote changed');
            return { action: 'changed', voteType, from: existingVote.voteType };
          }
        } else {
          // Create new vote
          await tx.testimonyVote.create({
            data: {
              userId: dbUserId,
              testimonyId: testimonyId,
              voteType: voteType
            }
          });

          // Update testimony counter
          if (voteType === 'UPVOTE') {
            await tx.testimony.update({
              where: { id: testimonyId },
              data: { upvotes: (testimony.upvotes || 0) + 1 }
            });
          } else {
            await tx.testimony.update({
              where: { id: testimonyId },
              data: { downvotes: (testimony.downvotes || 0) + 1 }
            });
          }

          console.log('✅ New vote created');
          return { action: 'added', voteType };
        }
      } catch (sqlError) {
        console.error('❌ Transaction failed:', sqlError);
        throw sqlError;
      }
    });

    console.log('✅ Vote operation completed:', result);
    return { success: true, ...result };
  } catch (err) {
    console.error("❌ Error voting on testimony:", err);
    
    // Provide more specific error messages
    if (err instanceof Error) {
      if (err.message.includes('foreign key constraint')) {
        return { error: "Database relationship error. Please refresh and try again." };
      } else if (err.message.includes('unique constraint')) {
        return { error: "Voting conflict detected. Please refresh and try again." };
      } else if (err.message.includes('Record to update not found')) {
        return { error: "Testimony no longer exists." };
      }
      
      console.error('❌ Detailed error:', err.message);
      return { error: `Voting failed: ${err.message}` };
    }
    
    return { error: "Failed to vote on testimony. Please try again." };
  }
}

export async function getTestimoniesWithVotes(
  sortBy: 'recent' | 'upvotes' | 'engagement' = 'recent',
  currentUserId?: string | null
) {
  try {
    let orderClause = 'ORDER BY t."createdAt" DESC';
    
    switch (sortBy) {
      case 'upvotes':
        orderClause = 'ORDER BY t."upvotes" DESC, t."createdAt" DESC';
        break;
      case 'engagement':
        orderClause = 'ORDER BY (t."upvotes" + t."downvotes") DESC, t."createdAt" DESC';
        break;
    }

    // If we have a currentUserId (Clerk ID), we need to find the database user ID
    let dbUserId: string | null = null;
    if (currentUserId) {
      try {
        const user = await prisma.user.findUnique({
          where: { clerkId: currentUserId },
          select: { id: true }
        });
        dbUserId = user?.id || null;
      } catch (userError) {
        console.log('Could not find user for vote lookup:', userError);
      }
    }

    const testimoniesQuery = `
      SELECT 
        t.*,
        u."username",
        u."isVerified",
        u."isWitness",
        ${dbUserId ? `v."voteType" as "userVote"` : 'NULL as "userVote"'}
      FROM "Testimony" t
      LEFT JOIN "User" u ON t."userId" = u."id"
      ${dbUserId ? `LEFT JOIN "TestimonyVote" v ON t."id" = v."testimonyId" AND v."userId" = '${dbUserId}'` : ''}
      WHERE t."status" = 'APPROVED'
      ${orderClause}
      LIMIT 50
    `;

    const testimonies = await prisma.$queryRawUnsafe(testimoniesQuery);
    
    return { success: true, testimonies };
  } catch (err) {
    console.error("Error fetching testimonies with votes:", err);
    return { error: "Failed to load testimonies" };
  }
}