-- AlterTable
ALTER TABLE "users" ADD COLUMN     "accepted_privacy_at" TIMESTAMP(3),
ADD COLUMN     "accepted_terms_at" TIMESTAMP(3),
ADD COLUMN     "privacy_version" TEXT,
ADD COLUMN     "terms_version" TEXT;
