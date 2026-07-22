/*
  Warnings:

  - Added the required column `template_id` to the `ai_draft_cvs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `template_id` to the `cvs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TemplateCategy" AS ENUM ('CORPORATE', 'CREATIVE', 'DARK', 'DEVELOPER', 'MINIMAL', 'MODERN');

-- AlterTable
ALTER TABLE "ai_draft_cvs" ADD COLUMN     "template_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "cvs" ADD COLUMN     "template_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "templates" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT,
    "name" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "category" "TemplateCategy" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Template_name_key" ON "templates"("name");

-- AddForeignKey
ALTER TABLE "cvs" ADD CONSTRAINT "cvs_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_draft_cvs" ADD CONSTRAINT "ai_draft_cvs_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
