const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPosts() {
  try {
    console.log('=== Checking NewsFeedPost table ===');
    const posts = await prisma.newsFeedPost.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            clerkId: true
          }
        }
      },
      take: 10
    });
    
    console.log(`Found ${posts.length} posts in NewsFeedPost table`);
    posts.forEach((post, index) => {
      console.log(`${index + 1}. Post ID: ${post.id}`);
      console.log(`   Content: ${post.content ? post.content.substring(0, 50) + '...' : 'No content'}`);
      console.log(`   Author ID: ${post.authorId}`);
      console.log(`   Author Username: ${post.author?.username || 'NULL'}`);
      console.log(`   Author ClerkID: ${post.author?.clerkId || 'NULL'}`);
      console.log('   ---');
    });
    
    console.log('\n=== Checking legacy Post table ===');
    const legacyPosts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            clerkId: true
          }
        }
      },
      take: 10
    });
    
    console.log(`Found ${legacyPosts.length} posts in legacy Post table`);
    legacyPosts.forEach((post, index) => {
      console.log(`${index + 1}. Legacy Post ID: ${post.id}`);
      console.log(`   Content: ${post.content ? post.content.substring(0, 50) + '...' : 'No content'}`);
      console.log(`   User ID: ${post.userId}`);
      console.log(`   User Username: ${post.user?.username || 'NULL'}`);
      console.log(`   User ClerkID: ${post.user?.clerkId || 'NULL'}`);
      console.log('   ---');
    });

    // Check for orphaned posts (posts with no valid user)
    console.log('\n=== Checking for orphaned posts ===');
    const orphanedNewsFeed = await prisma.newsFeedPost.findMany({
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

    console.log(`Found ${orphanedNewsFeed.length} orphaned NewsFeedPosts`);
    
    const orphanedLegacy = await prisma.post.findMany({
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

    console.log(`Found ${orphanedLegacy.length} orphaned legacy Posts`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPosts();