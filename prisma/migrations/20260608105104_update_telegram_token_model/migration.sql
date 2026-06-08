/*
  Warnings:

  - You are about to drop the column `first_name` on the `telegram_login_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `telegram_login_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `user_name` on the `telegram_login_tokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "telegram_login_tokens" DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "user_name";
