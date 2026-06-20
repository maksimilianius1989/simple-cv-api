/*
  Warnings:

  - Made the column `content` on table `cvs` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AiDraftCvStatus" AS ENUM ('DRAFT', 'GENERATED');

-- AlterTable
ALTER TABLE "cvs" ALTER COLUMN "content" SET NOT NULL;

-- CreateTable
CREATE TABLE "ai_draft_cvs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "raw" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "status" "AiDraftCvStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_draft_cvs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ai_draft_cvs" ADD CONSTRAINT "ai_draft_cvs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
