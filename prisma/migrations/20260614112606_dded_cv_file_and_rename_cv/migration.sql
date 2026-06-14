/*
  Warnings:

  - You are about to drop the `user_cv_data` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('PDF', 'PREVIEW', 'AVATAR');

-- DropForeignKey
ALTER TABLE "cv_views" DROP CONSTRAINT "cv_views_cv_id_fkey";

-- DropForeignKey
ALTER TABLE "user_cv_data" DROP CONSTRAINT "user_cv_data_user_id_fkey";

-- DropTable
DROP TABLE "user_cv_data";

-- CreateTable
CREATE TABLE "cvs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'N/A',
    "user_summary" TEXT NOT NULL,
    "json_summary" JSONB,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "published_until" TIMESTAMP(3),
    "views_count" INTEGER NOT NULL DEFAULT 0,
    "public_slug" TEXT,
    "is_deactivated" BOOLEAN NOT NULL DEFAULT false,
    "pdf_path" TEXT,
    "preview_path" TEXT,
    "avatar" TEXT,
    "cover_letter" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cvs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_files" (
    "id" TEXT NOT NULL,
    "cv_id" TEXT NOT NULL,
    "type" "FileType" NOT NULL,
    "path" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size" INTEGER,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cv_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cvs_public_slug_key" ON "cvs"("public_slug");

-- CreateIndex
CREATE INDEX "cvs_id_user_id_idx" ON "cvs"("id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "cv_files_cv_id_type_key" ON "cv_files"("cv_id", "type");

-- AddForeignKey
ALTER TABLE "cvs" ADD CONSTRAINT "cvs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_views" ADD CONSTRAINT "cv_views_cv_id_fkey" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_files" ADD CONSTRAINT "cv_files_cv_id_fkey" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
