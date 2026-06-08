/*
  Warnings:

  - You are about to drop the column `is_active` on the `gemini_api_keys` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "gemini_api_keys" DROP COLUMN "is_active",
ADD COLUMN     "last_reset" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
