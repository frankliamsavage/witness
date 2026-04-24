console.log('👁️ Setting up witness user...');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setupWitness() {
  try {
    // Connect to database
    await prisma.$connect();
    console.log('✅ Database connected');

    // List current users to help identify which one to make witness
    const users = await prisma.user.findMany({
      select: {
        id: true,
        clerkId: true,
        username: true,
        isWitness: true,
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
      console.log(`   Witness: ${user.isWitness ? '👁️ YES' : '❌ No'}`);
      console.log(`   Admin: ${user.isAdmin ? '✅ YES' : '❌ No'}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('');
    });

    // Make the most recent user a witness
    if (users.length > 0) {
      const latestUser = users[0];
      
      if (!latestUser.isWitness) {
        console.log(`👁️ Making user ${latestUser.username || 'Unknown'} a witness...`);
        
        await prisma.user.update({
          where: { id: latestUser.id },
          data: { 
            isWitness: true,
            isAdmin: true // Also make them admin if they aren't already
          }
        });
        
        console.log('✅ User is now a witness and can respond to questions!');
      } else {
        console.log('ℹ️ Latest user is already a witness');
      }
    } else {
      console.log('❌ No users found in database');
    }

    console.log('✅ Witness setup completed');

  } catch (error) {
    console.error('❌ Witness setup failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupWitness();