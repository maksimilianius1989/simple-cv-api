-- DropForeignKey
ALTER TABLE "cv_files" DROP CONSTRAINT "cv_files_cv_id_fkey";

-- DropIndex
DROP INDEX "cv_files_cv_id_category_key";

-- CreateIndex
CREATE INDEX "cv_files_cv_id_idx" ON "cv_files"("cv_id");
