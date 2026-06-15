/*
  Warnings:

  - You are about to drop the column `avatar` on the `cvs` table. All the data in the column will be lost.
  - You are about to drop the column `pdf_path` on the `cvs` table. All the data in the column will be lost.
  - You are about to drop the column `preview_path` on the `cvs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cvs" DROP COLUMN "avatar",
DROP COLUMN "pdf_path",
DROP COLUMN "preview_path";
