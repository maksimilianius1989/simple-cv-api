/*
  Warnings:

  - You are about to drop the column `apiKey` on the `gemini_api_keys` table. All the data in the column will be lost.
  - You are about to drop the column `projectName` on the `gemini_api_keys` table. All the data in the column will be lost.
  - You are about to drop the column `projectNumber` on the `gemini_api_keys` table. All the data in the column will be lost.
  - You are about to drop the column `usageLimit` on the `gemini_api_keys` table. All the data in the column will be lost.
  - You are about to drop the column `usedCount` on the `gemini_api_keys` table. All the data in the column will be lost.
  - You are about to drop the column `jsonSummary` on the `user_cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `userSummary` on the `user_cv_data` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[api_key]` on the table `gemini_api_keys` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `api_key` to the `gemini_api_keys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_name` to the `gemini_api_keys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_number` to the `gemini_api_keys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `json_summary` to the `user_cv_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_summary` to the `user_cv_data` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "gemini_api_keys_apiKey_key";

-- AlterTable
ALTER TABLE "gemini_api_keys" DROP COLUMN "apiKey",
DROP COLUMN "projectName",
DROP COLUMN "projectNumber",
DROP COLUMN "usageLimit",
DROP COLUMN "usedCount",
ADD COLUMN     "api_key" TEXT NOT NULL,
ADD COLUMN     "project_name" TEXT NOT NULL,
ADD COLUMN     "project_number" TEXT NOT NULL,
ADD COLUMN     "usage_limit" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "used_count" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "user_cv_data" DROP COLUMN "jsonSummary",
DROP COLUMN "userSummary",
ADD COLUMN     "json_summary" JSONB NOT NULL,
ADD COLUMN     "user_summary" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "gemini_api_keys_api_key_key" ON "gemini_api_keys"("api_key");

-- AddForeignKey
ALTER TABLE "telegram_login_tokens" ADD CONSTRAINT "telegram_login_tokens_telegram_id_fkey" FOREIGN KEY ("telegram_id") REFERENCES "users"("telegram_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_cv_data" ADD CONSTRAINT "user_cv_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
