const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const userIds = ['cmj7i5c4n0000l804ntwv51vb', 'cmjls9h3u0000kz040t7ixt40'];
    
    for (const userId of userIds) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          clerkId: true,
          username: true,
          legalName: true,
          email: true,
          profilePicture: true,
          createdAt: true
        }
      });
      
      console.log('User ID:', userId);
      console.log('Clerk ID:', user?.clerkId || 'NULL');
      console.log('Username:', user?.username || 'NULL');
      console.log('Legal Name:', user?.legalName || 'NULL');
      console.log('Email:', user?.email || 'NULL');
      console.log('Created:', user?.createdAt || 'NULL');
      console.log('---');
    }

    // Also check all users with NULL usernames
    console.log('=== All users with NULL usernames ===');
    const nullUsernameUsers = await prisma.user.findMany({
      where: {
        username: null
      },
      select: {
        id: true,
        clerkId: true,
        username: true,
        legalName: true,
        email: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            authoredPosts: true
          }
        }
      }
    });

    console.log(`Found ${nullUsernameUsers.length} users with NULL usernames:`);
    nullUsernameUsers.forEach((user, index) => {
      console.log(`${index + 1}. User ID: ${user.id}`);
      console.log(`   Clerk ID: ${user.clerkId}`);
      console.log(`   Legal Name: ${user.legalName || 'NULL'}`);
      console.log(`   Email: ${user.email || 'NULL'}`);
      console.log(`   Legacy Posts: ${user._count.posts}`);
      console.log(`   NewsFeed Posts: ${user._count.authoredPosts}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('   ---');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();