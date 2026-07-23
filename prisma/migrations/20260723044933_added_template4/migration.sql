/*
  Warnings:

  - Made the column `template_id` on table `ai_draft_cvs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `template_id` on table `cvs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ai_draft_cvs" ALTER COLUMN "template_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "cvs" ALTER COLUMN "template_id" SET NOT NULL;
