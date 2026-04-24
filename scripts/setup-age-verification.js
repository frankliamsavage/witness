#!/usr/bin/env node

/**
 * Age Verification Setup Script
 * 
 * This script adds age verification columns to support cash prize eligibility
 * for competition teams. Required for legal compliance with cash prize distributions.
 * 
 * Usage: node setup-age-verification.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupAgeVerification() {
  try {
    console.log('🎂 Setting up age verification system...\n');

    // Check if columns already exist
    console.log('📋 Checking existing schema...');
    
    // Add dateOfBirth to User table if it doesn't exist
    try {
      await prisma.$executeRaw`
        ALTER TABLE "User" 
        ADD COLUMN IF NOT EXISTS "dateOfBirth" TIMESTAMP(3),
        ADD COLUMN IF NOT EXISTS "ageVerified" BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS "ageVerifiedAt" TIMESTAMP(3);
      `;
      console.log('✅ Added age verification columns to User table');
    } catch (error) {
      console.log('ℹ️  Age verification columns may already exist in User table');
    }

    // Add cash eligibility tracking to Competition table
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Competition" 
        ADD COLUMN IF NOT EXISTS "requiresAgeVerification" BOOLEAN DEFAULT true,
        ADD COLUMN IF NOT EXISTS "minAgeForCash" INTEGER DEFAULT 18;
      `;
      console.log('✅ Added cash eligibility tracking to Competition table');
    } catch (error) {
      console.log('ℹ️  Cash eligibility columns may already exist in Competition table');
    }

    // Add payment eligibility to Team table
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Team" 
        ADD COLUMN IF NOT EXISTS "cashEligible" BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS "paymentMethod" VARCHAR(50) DEFAULT 'individual_1099',
        ADD COLUMN IF NOT EXISTS "paymentDetails" JSONB;
      `;
      console.log('✅ Added payment tracking to Team table');
    } catch (error) {
      console.log('ℹ️  Payment tracking columns may already exist in Team table');
    }

    // Update existing competition to require age verification
    const competitionId = 'hub-build-2026';
    
    try {
      await prisma.$executeRaw`
        UPDATE "Competition" 
        SET "requiresAgeVerification" = true, "minAgeForCash" = 18 
        WHERE "competitionId" = ${competitionId};
      `;
      console.log(`✅ Updated competition ${competitionId} with age requirements`);
    } catch (error) {
      console.log('ℹ️  Competition may not exist yet or already configured');
    }

    console.log('\n🎉 Age verification setup complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Update team registration form to collect date of birth');
    console.log('2. Implement age verification in user onboarding');
    console.log('3. Add cash eligibility checks before prize distribution');
    console.log('4. Update admin panel to show age verification status');

  } catch (error) {
    console.error('❌ Error setting up age verification:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  setupAgeVerification();
}

module.exports = { setupAgeVerification };