/*
  Warnings:

  - You are about to drop the column `raw` on the `ai_draft_cvs` table. All the data in the column will be lost.
  - Added the required column `prompt` to the `ai_draft_cvs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ai_draft_cvs" DROP COLUMN "raw",
ADD COLUMN     "error" TEXT,
ADD COLUMN     "prompt" TEXT NOT NULL,
ADD COLUMN     "provider" "AiProviderType",
ALTER COLUMN "content" DROP NOT NULL;
