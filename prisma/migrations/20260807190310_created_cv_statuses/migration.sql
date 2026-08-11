/*
  Warnings:

  - Added the required column `status` to the `cvs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CvStatus" AS ENUM ('CREATED', 'AVATAR_UPLOADED', 'PDF_GENERATED', 'PREVIEW_GENERATED', 'COMPLETED', 'FAILED', 'DELETED');

-- AlterTable
ALTER TABLE "cvs" ADD COLUMN     "status" "CvStatus" NOT NULL;
