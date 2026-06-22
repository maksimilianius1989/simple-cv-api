/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ai_provider_keys` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ai_provider_keys_name_key" ON "ai_provider_keys"("name");
