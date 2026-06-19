/*
  Warnings:

  - You are about to drop the column `json_summary` on the `cvs` table. All the data in the column will be lost.
  - You are about to drop the column `user_summary` on the `cvs` table. All the data in the column will be lost.
  - Added the required column `content` to the `cvs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cvs" DROP COLUMN "user_summary",
ALTER COLUMN "title" DROP DEFAULT;
ALTER TABLE "cvs" RENAME "json_summary" TO "content";
