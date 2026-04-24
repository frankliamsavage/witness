-- Add age verification and cash prize eligibility tracking
-- Migration: add_age_verification_and_cash_eligibility.sql

-- Add age verification columns to User table
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "dateOfBirth" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "ageVerified" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "ageVerifiedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "parentalConsent" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "parentalConsentAt" TIMESTAMP(3);

-- Add competition age requirements
ALTER TABLE "Competition" 
ADD COLUMN IF NOT EXISTS "requiresAgeVerification" BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS "minAgeForCash" INTEGER DEFAULT 18,
ADD COLUMN IF NOT EXISTS "minAgeForParticipation" INTEGER DEFAULT 13;

-- Add team cash eligibility tracking
ALTER TABLE "Team" 
ADD COLUMN IF NOT EXISTS "cashEligible" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "cashEligibilityChecked" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "cashEligibilityCheckedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "paymentMethod" VARCHAR(50) DEFAULT 'individual_1099',
ADD COLUMN IF NOT EXISTS "paymentDetails" JSONB,
ADD COLUMN IF NOT EXISTS "ineligibilityReason" TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "User_ageVerified_idx" ON "User"("ageVerified");
CREATE INDEX IF NOT EXISTS "Team_cashEligible_idx" ON "Team"("cashEligible");
CREATE INDEX IF NOT EXISTS "User_dateOfBirth_idx" ON "User"("dateOfBirth");

-- Update existing competition with age requirements
UPDATE "Competition" 
SET 
  "requiresAgeVerification" = true, 
  "minAgeForCash" = 18,
  "minAgeForParticipation" = 13
WHERE "competitionId" = 'hub-build-2026';

-- Comments
COMMENT ON COLUMN "User"."dateOfBirth" IS 'User date of birth for age verification';
COMMENT ON COLUMN "User"."ageVerified" IS 'Whether user age has been verified';
COMMENT ON COLUMN "User"."parentalConsent" IS 'Whether parental consent obtained for minors';
COMMENT ON COLUMN "Team"."cashEligible" IS 'Whether team eligible for cash prizes (all members 18+)';
COMMENT ON COLUMN "Team"."paymentMethod" IS 'How cash prizes will be distributed (individual_1099, captain_payout)';
COMMENT ON COLUMN "Team"."ineligibilityReason" IS 'Reason team is not eligible for cash prizes';