/*
  Warnings:

  - Changed the type of `category` on the `templates` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TemplateCategory" AS ENUM ('CORPORATE', 'CREATIVE', 'DARK', 'DEVELOPER', 'MINIMAL', 'MODERN');

-- AlterTable
ALTER TABLE "ai_draft_cvs" ALTER COLUMN "template_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "templates" DROP COLUMN "category",
ADD COLUMN     "category" "TemplateCategory" NOT NULL;

-- DropEnum
DROP TYPE "TemplateCategy";

-- CreateIndex
CREATE INDEX "templates_category_idx" ON "templates"("category");
