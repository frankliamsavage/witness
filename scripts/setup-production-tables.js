// One-time production database setup
require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupProductionTables() {
  console.log('🚀 Setting up production database tables...');
  
  try {
    await prisma.$connect();
    console.log('✅ Connected to production database');
    
    // Check what tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('📊 Existing tables:', tables);
    
    // Check if Testimony table exists
    const testimonyTableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Testimony'
      );
    `;
    
    console.log('🔍 Testimony table exists:', testimonyTableExists);
    
    if (!testimonyTableExists[0].exists) {
      console.log('📝 Creating Testimony table...');
      
      // Create the Testimony table manually
      await prisma.$executeRaw`
        CREATE TYPE "TestimonyStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
      `;
      
      await prisma.$executeRaw`
        CREATE TABLE "Testimony" (
          "id" TEXT NOT NULL,
          "content" TEXT NOT NULL,
          "authorName" TEXT NOT NULL,
          "contactEmail" TEXT,
          "isGuest" BOOLEAN NOT NULL DEFAULT false,
          "status" "TestimonyStatus" NOT NULL DEFAULT 'PENDING',
          "userId" TEXT,
          "moderatedBy" TEXT,
          "moderatedAt" TIMESTAMP(3),
          "moderationNotes" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Testimony_pkey" PRIMARY KEY ("id")
        );
      `;
      
      // Add foreign key if User table exists
      const userTableExists = await prisma.$queryRaw`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'User'
        );
      `;
      
      if (userTableExists[0].exists) {
        await prisma.$executeRaw`
          ALTER TABLE "Testimony" 
          ADD CONSTRAINT "Testimony_userId_fkey" 
          FOREIGN KEY ("userId") REFERENCES "User"("id") 
          ON DELETE CASCADE ON UPDATE CASCADE;
        `;
        console.log('✅ Added foreign key constraint to User table');
      }
      
      // Add indexes
      await prisma.$executeRaw`CREATE INDEX "Testimony_status_idx" ON "Testimony"("status");`;
      await prisma.$executeRaw`CREATE INDEX "Testimony_createdAt_idx" ON "Testimony"("createdAt");`;
      await prisma.$executeRaw`CREATE INDEX "Testimony_userId_idx" ON "Testimony"("userId");`;
      
      console.log('✅ Testimony table created successfully!');
    } else {
      console.log('✅ Testimony table already exists');
    }
    
    // Test the table
    const count = await prisma.testimony.count();
    console.log(`✅ Testimony table working! Current records: ${count}`);
    
  } catch (err) {
    console.error('❌ Error setting up tables:', err);
    
    // If enum already exists, that's okay
    if (err.message && err.message.includes('already exists')) {
      console.log('⚠️  Some objects already exist, continuing...');
      
      try {
        const count = await prisma.testimony.count();
        console.log(`✅ Testimony table is working! Current records: ${count}`);
      } catch (testErr) {
        console.error('❌ Testimony table still not working:', testErr);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

setupProductionTables().catch(console.error);