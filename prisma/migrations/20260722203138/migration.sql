-- DropForeignKey
ALTER TABLE "cvs" DROP CONSTRAINT "cvs_template_id_fkey";

-- DropIndex
DROP INDEX "cvs_id_user_id_idx";

-- AlterTable
ALTER TABLE "cvs" ALTER COLUMN "template_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "templates" RENAME CONSTRAINT "Template_pkey" TO "templates_pkey";

-- CreateIndex
CREATE INDEX "ai_draft_cvs_user_id_idx" ON "ai_draft_cvs"("user_id");

-- CreateIndex
CREATE INDEX "ai_draft_cvs_updated_at_idx" ON "ai_draft_cvs"("updated_at");

-- CreateIndex
CREATE INDEX "cv_views_viewedAt_idx" ON "cv_views"("viewedAt");

-- CreateIndex
CREATE INDEX "cvs_user_id_idx" ON "cvs"("user_id");

-- CreateIndex
CREATE INDEX "cvs_updated_at_idx" ON "cvs"("updated_at");

-- CreateIndex
CREATE INDEX "templates_category_idx" ON "templates"("category");

-- CreateIndex
CREATE INDEX "templates_updated_at_idx" ON "templates"("updated_at");

-- AddForeignKey
ALTER TABLE "cvs" ADD CONSTRAINT "cvs_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Template_name_key" RENAME TO "templates_name_key";
