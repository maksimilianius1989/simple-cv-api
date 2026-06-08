/*
  Warnings:

  - You are about to drop the column `last_reset_at` on the `gemini_api_keys` table. All the data in the column will be lost.
  - You are about to drop the column `used_count` on the `gemini_api_keys` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "gemini_api_keys_used_count_updated_at_idx";

-- AlterTable
ALTER TABLE "gemini_api_keys" DROP COLUMN "last_reset_at",
DROP COLUMN "used_count",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "usage_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "used_today" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "usage_limit" SET DEFAULT 1000;
