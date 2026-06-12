/*
  Warnings:

  - You are about to drop the column `browser_version` on the `cv_views` table. All the data in the column will be lost.
  - You are about to drop the column `ip` on the `cv_views` table. All the data in the column will be lost.
  - You are about to drop the column `viewed_at` on the `cv_views` table. All the data in the column will be lost.
  - Added the required column `visitor_id` to the `cv_views` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "cv_views_ip_idx";

-- AlterTable
ALTER TABLE "cv_views" DROP COLUMN "browser_version",
DROP COLUMN "ip",
DROP COLUMN "viewed_at",
ADD COLUMN     "browser_v" TEXT,
ADD COLUMN     "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "visitor_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "cv_views_visitor_id_idx" ON "cv_views"("visitor_id");
