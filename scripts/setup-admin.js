console.log('🔧 Setting up admin user...');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setupAdmin() {
  try {
    // Connect to database
    await prisma.$connect();
    console.log('✅ Database connected');

    // List current users to help identify which one to make admin
    const users = await prisma.user.findMany({
      select: {
        id: true,
        clerkId: true,
        username: true,
        isAdmin: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    console.log('👥 Current users:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id.substring(0, 8)}...`);
      console.log(`   Clerk ID: ${user.clerkId.substring(0, 8)}...`);
      console.log(`   Username: ${user.username || 'No username'}`);
      console.log(`   Admin: ${user.isAdmin ? '✅ YES' : '❌ No'}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('');
    });

    // If you want to make the most recent user an admin, uncomment this:
    if (users.length > 0) {
      const latestUser = users[0];
      
      if (!latestUser.isAdmin) {
        console.log(`🔧 Making user ${latestUser.username || 'Unknown'} an admin...`);
        
        await prisma.user.update({
          where: { id: latestUser.id },
          data: { isAdmin: true }
        });
        
        console.log('✅ User is now an admin!');
      } else {
        console.log('ℹ️ Latest user is already an admin');
      }
    } else {
      console.log('❌ No users found in database');
    }

    console.log('✅ Admin setup completed');

  } catch (error) {
    console.error('❌ Admin setup failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdmin();