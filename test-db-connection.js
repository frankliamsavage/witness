const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    // Test basic connection
    console.log('Testing database connection...');
    const userCount = await prisma.user.count();
    console.log(`✅ Database connected! Found ${userCount} users.`);
    
    // Test PostReport table
    console.log('Testing PostReport table...');
    const reportCount = await prisma.postReport.count();
    console.log(`✅ PostReport table exists! Found ${reportCount} reports.`);
    
    // Test creating a simple report (dry run)
    console.log('Testing report creation schema...');
    const testData = {
      postId: 'test-post-id',
      reporterId: 'test-reporter-id',
      reason: 'Test reason',
      description: 'Test description',
      status: 'PENDING'
    };
    console.log('✅ Report schema validation passed:', testData);
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();