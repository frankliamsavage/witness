const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database tables...');
    
    // Check if PostComment table exists
    const commentCount = await prisma.postComment.count();
    console.log('✅ PostComment table exists with', commentCount, 'records');
    
    // Check if NewsFeedPost table exists
    const postCount = await prisma.newsFeedPost.count();
    console.log('✅ NewsFeedPost table exists with', postCount, 'records');
    
    // List all tables
    const tables = await prisma.$queryRaw`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename;
    `;
    console.log('📋 All tables:', tables.map(t => t.tablename).join(', '));
    
  } catch (error) {
    console.error('❌ Database check failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();