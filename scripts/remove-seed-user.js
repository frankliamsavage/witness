console.log('🧹 Cleaning up seed user...');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function removeSeedUser() {
  try {
    // Connect to database
    await prisma.$connect();
    console.log('✅ Database connected');

    // Find the seed user
    const seedUser = await prisma.user.findUnique({
      where: { username: 'seeduser' },
      include: {
        testimonies: true,
        videos: true,
        posts: true,
        testimonyVotes: true
      }
    });

    if (!seedUser) {
      console.log('ℹ️ Seed user not found');
      return;
    }

    console.log('🔍 Found seed user:');
    console.log(`   ID: ${seedUser.id.substring(0, 8)}...`);
    console.log(`   Clerk ID: ${seedUser.clerkId}`);
    console.log(`   Username: ${seedUser.username}`);
    console.log(`   Created: ${seedUser.createdAt}`);
    console.log(`   Testimonies: ${seedUser.testimonies.length}`);
    console.log(`   Videos: ${seedUser.videos.length}`);
    console.log(`   Posts: ${seedUser.posts.length}`);
    console.log(`   Votes: ${seedUser.testimonyVotes.length}`);

    // Delete the seed user (this will cascade delete related data)
    console.log('🗑️ Deleting seed user...');
    
    await prisma.user.delete({
      where: { id: seedUser.id }
    });

    console.log('✅ Seed user deleted successfully!');

    // Verify deletion
    const remainingUsers = await prisma.user.count();
    console.log(`📊 Remaining users in database: ${remainingUsers}`);

  } catch (error) {
    console.error('❌ Failed to remove seed user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeSeedUser();