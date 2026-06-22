/*
  Warnings:

  - You are about to drop the `gemini_api_keys` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AiProviderType" AS ENUM ('GEMINI', 'OLLAMA');

-- DropTable
DROP TABLE "gemini_api_keys";

-- CreateTable
CREATE TABLE "ai_provider_keys" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "provider" "AiProviderType" NOT NULL,
    "usage_limit" INTEGER NOT NULL DEFAULT 10,
    "used_today" INTEGER NOT NULL DEFAULT 0,
    "usage_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_provider_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ai_provider_keys_value_key" ON "ai_provider_keys"("value");
