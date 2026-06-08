-- AlterTable
ALTER TABLE "gemini_api_keys" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "telegram_login_tokens" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "gemini_api_keys_used_count_updated_at_idx" ON "gemini_api_keys"("used_count", "updated_at");

-- CreateIndex
CREATE INDEX "user_cv_data_user_id_created_at_idx" ON "user_cv_data"("user_id", "created_at");
