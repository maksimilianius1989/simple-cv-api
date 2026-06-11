/*
  Warnings:

  - You are about to drop the column `publick_slug` on the `user_cv_data` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[public_slug]` on the table `user_cv_data` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "user_cv_data_publick_slug_key";

-- AlterTable
ALTER TABLE "user_cv_data" DROP COLUMN "publick_slug",
ADD COLUMN     "public_slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_cv_data_public_slug_key" ON "user_cv_data"("public_slug");
