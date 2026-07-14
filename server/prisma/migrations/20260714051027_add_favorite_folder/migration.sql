-- AlterTable
ALTER TABLE "ToolFavorite" ADD COLUMN     "folder" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "FavoriteFolder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteFolder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FavoriteFolder_userId_idx" ON "FavoriteFolder"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteFolder_userId_name_key" ON "FavoriteFolder"("userId", "name");

-- AddForeignKey
ALTER TABLE "FavoriteFolder" ADD CONSTRAINT "FavoriteFolder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
