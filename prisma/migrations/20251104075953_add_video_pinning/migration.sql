-- Add pinning functionality to Video table
ALTER TABLE "Video" ADD COLUMN "isPinned" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Video" ADD COLUMN "pinnedAt" TIMESTAMP(3);