-- AlterTable
ALTER TABLE "user_cv_data" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "public_expires_at" TIMESTAMP(3),
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'N/A',
ALTER COLUMN "json_summary" DROP NOT NULL;
