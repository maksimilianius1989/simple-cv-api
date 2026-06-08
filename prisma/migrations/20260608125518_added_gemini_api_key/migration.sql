-- CreateTable
CREATE TABLE "gemini_api_keys" (
    "id" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "projectNumber" TEXT NOT NULL,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "usageLimit" INTEGER NOT NULL DEFAULT 10,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gemini_api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gemini_api_keys_apiKey_key" ON "gemini_api_keys"("apiKey");
