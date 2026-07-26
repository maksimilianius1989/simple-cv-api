/*
  Warnings:

  - The values [GENERATED,GENERATION] on the enum `AiDraftCvStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AiDraftCvStatus_new" AS ENUM ('DRAFT', 'AVATAR_UPLOADED', 'GENERATING_CONTENT', 'CONTENT_GENERATED', 'PDF_GENERATED', 'PREVIEW_GENERATED', 'COMPLETED', 'FAILED', 'DELETED');
ALTER TABLE "ai_draft_cvs" ALTER COLUMN "status" TYPE "AiDraftCvStatus_new" USING ("status"::text::"AiDraftCvStatus_new");
ALTER TYPE "AiDraftCvStatus" RENAME TO "AiDraftCvStatus_old";
ALTER TYPE "AiDraftCvStatus_new" RENAME TO "AiDraftCvStatus";
DROP TYPE "public"."AiDraftCvStatus_old";
COMMIT;
