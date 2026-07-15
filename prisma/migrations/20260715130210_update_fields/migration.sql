/*
  Warnings:

  - You are about to drop the column `type` on the `cv_files` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cv_id,category]` on the table `cv_files` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `cv_files` table without a default value. This is not possible if the table is not empty.
  - Made the column `size` on table `cv_files` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "FileCategory" AS ENUM ('PDF', 'PREVIEW', 'PREVIEW_THUMBNAIL', 'AVATAR');

-- DropIndex
DROP INDEX "cv_files_cv_id_type_key";

-- AlterTable
ALTER TABLE "cv_files" DROP COLUMN "type",
ADD COLUMN     "category" "FileCategory" NOT NULL,
ALTER COLUMN "size" SET NOT NULL;

-- DropEnum
DROP TYPE "FileType";

-- CreateIndex
CREATE UNIQUE INDEX "cv_files_cv_id_category_key" ON "cv_files"("cv_id", "category");
