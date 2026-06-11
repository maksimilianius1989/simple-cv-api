/*
  Warnings:

  - You are about to drop the column `is_deleted` on the `user_cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `is_public` on the `user_cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `public_expires_at` on the `user_cv_data` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_cv_data" DROP COLUMN "is_deleted",
DROP COLUMN "is_public",
DROP COLUMN "public_expires_at",
ADD COLUMN     "is_deactivated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publick_slug" TEXT,
ADD COLUMN     "published_at" TIMESTAMP(3),
ADD COLUMN     "published_until" TIMESTAMP(3),
ADD COLUMN     "views_count" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "publish_cvs" (
    "id" TEXT NOT NULL,
    "parent_cv_id" TEXT NOT NULL,
    "published_to" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "publish_cvs_pkey" PRIMARY KEY ("id")
);
