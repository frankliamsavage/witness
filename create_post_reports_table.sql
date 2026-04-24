-- Create PostReport table for legal violation reports
-- This table stores reports submitted by users about posts that violate laws

CREATE TABLE IF NOT EXISTS "PostReport" (
  id TEXT NOT NULL PRIMARY KEY,
  "postId" TEXT NOT NULL,
  "reporterId" TEXT NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  "adminNotes" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "resolvedAt" TIMESTAMP,
  "resolvedBy" TEXT,
  
  -- Foreign key constraints
  CONSTRAINT "PostReport_postId_fkey" FOREIGN KEY ("postId") REFERENCES "NewsFeedPost"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "PostReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "PostReport_postId_idx" ON "PostReport"("postId");
CREATE INDEX IF NOT EXISTS "PostReport_reporterId_idx" ON "PostReport"("reporterId");
CREATE INDEX IF NOT EXISTS "PostReport_status_idx" ON "PostReport"(status);
CREATE INDEX IF NOT EXISTS "PostReport_createdAt_idx" ON "PostReport"("createdAt");

-- Add comment to document the table purpose
COMMENT ON TABLE "PostReport" IS 'Legal violation reports submitted by users for posts that violate laws or platform policies';