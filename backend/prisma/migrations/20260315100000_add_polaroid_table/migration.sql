-- CreateTable
CREATE TABLE "Polaroid" (
    "id" TEXT NOT NULL,
    "src" TEXT NOT NULL DEFAULT '',
    "alt" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "rotation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Polaroid_pkey" PRIMARY KEY ("id")
);
