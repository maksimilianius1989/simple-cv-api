/*
  Warnings:

  - A unique constraint covering the columns `[cv_id,category]` on the table `cv_files` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "cv_files_cv_id_idx";

-- CreateIndex
CREATE UNIQUE INDEX "cv_files_cv_id_category_key" ON "cv_files"("cv_id", "category");
