/*
  Warnings:

  - You are about to drop the column `last_reset` on the `gemini_api_keys` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "gemini_api_keys" DROP COLUMN "last_reset",
ADD COLUMN     "last_reset_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
