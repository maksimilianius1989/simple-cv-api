/*
  Warnings:

  - Added the required column `model` to the `ai_provider_keys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ai_provider_keys" ADD COLUMN     "model" TEXT NOT NULL;
