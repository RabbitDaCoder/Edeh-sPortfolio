-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "category" TEXT,
ADD COLUMN     "commentsEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "contentSource" TEXT DEFAULT 'richtext',
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "CareerTimeline" ALTER COLUMN "points" DROP DEFAULT,
ALTER COLUMN "keySkills" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "body" TEXT NOT NULL,
    "parentId" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "spam" BOOLEAN NOT NULL DEFAULT false,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuestbookEntry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" VARCHAR(280) NOT NULL,
    "handle" VARCHAR(80),
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "flagged" BOOLEAN NOT NULL DEFAULT false,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuestbookEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Comment_blogId_idx" ON "Comment"("blogId");

-- CreateIndex
CREATE INDEX "Comment_parentId_idx" ON "Comment"("parentId");

-- CreateIndex
CREATE INDEX "Comment_approved_idx" ON "Comment"("approved");

-- CreateIndex
CREATE INDEX "Comment_email_idx" ON "Comment"("email");

-- CreateIndex
CREATE INDEX "GuestbookEntry_approved_idx" ON "GuestbookEntry"("approved");

-- CreateIndex
CREATE INDEX "GuestbookEntry_pinned_idx" ON "GuestbookEntry"("pinned");

-- CreateIndex
CREATE INDEX "GuestbookEntry_createdAt_idx" ON "GuestbookEntry"("createdAt");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
