-- AlterEnum
ALTER TYPE "AiDraftCvStatus" ADD VALUE 'GENERATION';

-- AlterTable
ALTER TABLE "ai_draft_cvs" ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "cv_files" ADD COLUMN     "updated_at" TIMESTAMP(3);
