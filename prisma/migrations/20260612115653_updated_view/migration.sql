/*
  Warnings:

  - You are about to drop the column `user_agent` on the `cv_views` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cv_views" DROP COLUMN "user_agent",
ADD COLUMN     "browser_version" TEXT,
ADD COLUMN     "region" TEXT;
