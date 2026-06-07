-- AlterTable
ALTER TABLE "telegram_users" ALTER COLUMN "telegram_id" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "telegram_login_tokens" (
    "token" TEXT NOT NULL,
    "telegram_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "telegram_login_tokens_pkey" PRIMARY KEY ("token")
);
