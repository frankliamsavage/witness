-- Add hasCompletedInitialVerification field to prevent redundant age verification
-- This tracks whether a user has completed the initial signup age verification

ALTER TABLE "User" 
ADD COLUMN "hasCompletedInitialVerification" BOOLEAN DEFAULT false;

-- Update existing users to mark them as having completed initial verification
-- (since they've already been through the signup process)
UPDATE "User" 
SET "hasCompletedInitialVerification" = true 
WHERE "ageVerified" = true;