-- AlterEnum: Add BLOCKCHAIN and FOUNDER to TimelineType
ALTER TYPE "TimelineType" ADD VALUE IF NOT EXISTS 'BLOCKCHAIN';
ALTER TYPE "TimelineType" ADD VALUE IF NOT EXISTS 'FOUNDER';

-- AlterEnum: Add STATE, BLOCKCHAIN, OTHER, LANGUAGES to TechCategory
ALTER TYPE "TechCategory" ADD VALUE IF NOT EXISTS 'STATE';
ALTER TYPE "TechCategory" ADD VALUE IF NOT EXISTS 'BLOCKCHAIN';
ALTER TYPE "TechCategory" ADD VALUE IF NOT EXISTS 'OTHER';
ALTER TYPE "TechCategory" ADD VALUE IF NOT EXISTS 'LANGUAGES';

-- AlterTable: CareerTimeline — add date, points, keySkills
ALTER TABLE "CareerTimeline" ADD COLUMN IF NOT EXISTS "date" TEXT;
ALTER TABLE "CareerTimeline" ADD COLUMN IF NOT EXISTS "points" TEXT[] DEFAULT '{}';
ALTER TABLE "CareerTimeline" ADD COLUMN IF NOT EXISTS "keySkills" TEXT[] DEFAULT '{}';

-- AlterTable: Achievement — change date from DateTime to String, add order
-- First drop the old DateTime column and recreate as text
ALTER TABLE "Achievement" ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0;
-- Rename old date column, create new text column, migrate data, drop old
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Achievement' AND column_name = 'date' AND data_type = 'timestamp without time zone'
  ) THEN
    ALTER TABLE "Achievement" RENAME COLUMN "date" TO "date_old";
    ALTER TABLE "Achievement" ADD COLUMN "date" TEXT;
    UPDATE "Achievement" SET "date" = TO_CHAR("date_old", 'YYYY') WHERE "date_old" IS NOT NULL;
    ALTER TABLE "Achievement" DROP COLUMN "date_old";
  END IF;
END $$;

-- AlterTable: Download — add headline, lastUpdated
ALTER TABLE "Download" ADD COLUMN IF NOT EXISTS "headline" TEXT;
ALTER TABLE "Download" ADD COLUMN IF NOT EXISTS "lastUpdated" TEXT;

-- AlterTable: Project — add longDescription, projectType
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "longDescription" TEXT;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "projectType" TEXT NOT NULL DEFAULT 'personal';

-- AlterTable: Testimonial — add designation, initials
ALTER TABLE "Testimonial" ADD COLUMN IF NOT EXISTS "designation" TEXT;
ALTER TABLE "Testimonial" ADD COLUMN IF NOT EXISTS "initials" TEXT;

-- AlterTable: SiteProfile — add alias, subTagline, fullHeadline, phone, locationShort, portfolio, calendly
ALTER TABLE "SiteProfile" ADD COLUMN IF NOT EXISTS "alias" TEXT;
ALTER TABLE "SiteProfile" ADD COLUMN IF NOT EXISTS "subTagline" TEXT;
ALTER TABLE "SiteProfile" ADD COLUMN IF NOT EXISTS "fullHeadline" TEXT;
ALTER TABLE "SiteProfile" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE "SiteProfile" ADD COLUMN IF NOT EXISTS "locationShort" TEXT;
ALTER TABLE "SiteProfile" ADD COLUMN IF NOT EXISTS "portfolio" TEXT;
ALTER TABLE "SiteProfile" ADD COLUMN IF NOT EXISTS "calendly" TEXT;
