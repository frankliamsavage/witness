const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testUsernameFlow() {
  try {
    console.log('=== Testing Username Enforcement Flow ===');
    
    // Check how many users currently exist
    const totalUsers = await prisma.user.count();
    console.log(`Total users in database: ${totalUsers}`);
    
    // Check users without usernames
    const usersWithoutUsername = await prisma.user.findMany({
      where: {
        OR: [
          { username: null },
          { username: '' }
        ]
      },
      select: {
        id: true,
        clerkId: true,
        username: true,
        createdAt: true
      }
    });
    
    console.log(`\nUsers without usernames: ${usersWithoutUsername.length}`);
    usersWithoutUsername.forEach((user, index) => {
      console.log(`${index + 1}. User ID: ${user.id}`);
      console.log(`   Clerk ID: ${user.clerkId}`);
      console.log(`   Username: ${user.username || 'NULL'}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('   ---');
    });

    // Check users with usernames
    const usersWithUsername = await prisma.user.findMany({
      where: {
        username: {
          not: null
        }
      },
      select: {
        id: true,
        clerkId: true,
        username: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`\nUsers with usernames: ${usersWithUsername.length}`);
    usersWithUsername.forEach((user, index) => {
      console.log(`${index + 1}. User ID: ${user.id}`);
      console.log(`   Clerk ID: ${user.clerkId}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('   ---');
    });

    console.log('\n✅ Username flow is ready for testing!');
    console.log('Try logging in with a new account - it should redirect to /setup-username');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUsernameFlow();