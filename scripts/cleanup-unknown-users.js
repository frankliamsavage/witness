const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupUnknownUsers() {
  try {
    console.log('=== Cleaning up Unknown User posts ===');
    
    // Option 1: Delete posts from users with NULL usernames
    console.log('\n1. Finding posts from users with NULL usernames...');
    
    const orphanedNewsFeedPosts = await prisma.newsFeedPost.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            clerkId: true
          }
        }
      },
      where: {
        author: {
          username: null
        }
      }
    });

    const orphanedLegacyPosts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            clerkId: true
          }
        }
      },
      where: {
        user: {
          username: null
        }
      }
    });

    console.log(`Found ${orphanedNewsFeedPosts.length} orphaned NewsFeedPosts`);
    console.log(`Found ${orphanedLegacyPosts.length} orphaned legacy Posts`);

    // Show the posts that would be affected
    console.log('\nPosts that would be deleted:');
    orphanedNewsFeedPosts.forEach((post, index) => {
      console.log(`${index + 1}. "${post.content?.substring(0, 50)}..." (ID: ${post.id})`);
    });
    
    orphanedLegacyPosts.forEach((post, index) => {
      console.log(`${orphanedNewsFeedPosts.length + index + 1}. "${post.content?.substring(0, 50)}..." (Legacy ID: ${post.id})`);
    });

    // Ask for confirmation before deleting
    console.log('\n⚠️  WARNING: This will permanently delete the above posts.');
    console.log('Run this script with --confirm flag to proceed with deletion.');
    
    // Check if --confirm flag is passed
    if (process.argv.includes('--confirm')) {
      console.log('\n🗑️  Deleting orphaned posts...');
      
      // Delete NewsFeedPosts
      for (const post of orphanedNewsFeedPosts) {
        await prisma.newsFeedPost.delete({
          where: { id: post.id }
        });
        console.log(`   Deleted NewsFeedPost: ${post.id}`);
      }
      
      // Delete legacy Posts
      for (const post of orphanedLegacyPosts) {
        await prisma.post.delete({
          where: { id: post.id }
        });
        console.log(`   Deleted legacy Post: ${post.id}`);
      }
      
      console.log('✅ Cleanup completed successfully!');
      
      // Option 2: Give users temporary usernames instead
    } else if (process.argv.includes('--fix-usernames')) {
      console.log('\n🔧 Fixing users with NULL usernames...');
      
      const nullUsernameUsers = await prisma.user.findMany({
        where: {
          username: null
        },
        select: {
          id: true,
          clerkId: true,
          createdAt: true
        }
      });

      for (const user of nullUsernameUsers) {
        // Create a temporary username based on clerk ID
        const tempUsername = `user_${user.clerkId.slice(-8)}`;
        
        await prisma.user.update({
          where: { id: user.id },
          data: { username: tempUsername }
        });
        
        console.log(`   Fixed user ${user.id}: assigned username "${tempUsername}"`);
      }
      
      console.log('✅ Username fixing completed successfully!');
    } else {
      console.log('\nOptions:');
      console.log('  --confirm       Delete all orphaned posts permanently');
      console.log('  --fix-usernames Assign temporary usernames to users with NULL usernames');
    }
    
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupUnknownUsers();