/*
  Warnings:

  - The primary key for the `ai_draft_cvs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ai_provider_keys` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `cv_feedbacks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `cv_files` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `cv_views` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `cvs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `payments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `user_id` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `templates` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `owner_id` column on the `templates` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `user_identities` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `ai_draft_cvs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `ai_draft_cvs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `template_id` on the `ai_draft_cvs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `ai_provider_keys` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `cv_feedbacks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `cv_id` on the `cv_feedbacks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `cv_files` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `cv_id` on the `cv_files` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `cv_views` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `cv_id` on the `cv_views` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `cvs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `cvs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `template_id` on the `cvs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `templates` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `user_identities` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `user_identities` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "ai_draft_cvs" DROP CONSTRAINT "ai_draft_cvs_template_id_fkey";

-- DropForeignKey
ALTER TABLE "ai_draft_cvs" DROP CONSTRAINT "ai_draft_cvs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "cv_feedbacks" DROP CONSTRAINT "cv_feedbacks_cv_id_fkey";

-- DropForeignKey
ALTER TABLE "cv_views" DROP CONSTRAINT "cv_views_cv_id_fkey";

-- DropForeignKey
ALTER TABLE "cvs" DROP CONSTRAINT "cvs_template_id_fkey";

-- DropForeignKey
ALTER TABLE "cvs" DROP CONSTRAINT "cvs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_identities" DROP CONSTRAINT "user_identities_user_id_fkey";

-- AlterTable
ALTER TABLE "ai_draft_cvs" DROP CONSTRAINT "ai_draft_cvs_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" UUID NOT NULL,
DROP COLUMN "template_id",
ADD COLUMN     "template_id" UUID NOT NULL,
ADD CONSTRAINT "ai_draft_cvs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ai_provider_keys" DROP CONSTRAINT "ai_provider_keys_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "ai_provider_keys_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "cv_feedbacks" DROP CONSTRAINT "cv_feedbacks_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "cv_id",
ADD COLUMN     "cv_id" UUID NOT NULL,
ADD CONSTRAINT "cv_feedbacks_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "cv_files" DROP CONSTRAINT "cv_files_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "cv_id",
ADD COLUMN     "cv_id" UUID NOT NULL,
ADD CONSTRAINT "cv_files_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "cv_views" DROP CONSTRAINT "cv_views_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "cv_id",
ADD COLUMN     "cv_id" UUID NOT NULL,
ADD CONSTRAINT "cv_views_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "cvs" DROP CONSTRAINT "cvs_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" UUID NOT NULL,
DROP COLUMN "template_id",
ADD COLUMN     "template_id" UUID NOT NULL,
ADD CONSTRAINT "cvs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "payments" DROP CONSTRAINT "payments_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" UUID,
ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "templates" DROP CONSTRAINT "templates_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "owner_id",
ADD COLUMN     "owner_id" UUID,
ADD CONSTRAINT "templates_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_identities" DROP CONSTRAINT "user_identities_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" UUID NOT NULL,
ADD CONSTRAINT "user_identities_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "ai_draft_cvs_user_id_idx" ON "ai_draft_cvs"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "cv_files_cv_id_category_key" ON "cv_files"("cv_id", "category");

-- CreateIndex
CREATE INDEX "cv_views_cv_id_idx" ON "cv_views"("cv_id");

-- CreateIndex
CREATE INDEX "cv_views_cv_id_visitor_id_idx" ON "cv_views"("cv_id", "visitor_id");

-- CreateIndex
CREATE INDEX "cv_views_cv_id_country_idx" ON "cv_views"("cv_id", "country");

-- CreateIndex
CREATE INDEX "cv_views_cv_id_city_idx" ON "cv_views"("cv_id", "city");

-- CreateIndex
CREATE INDEX "cv_views_cv_id_device_idx" ON "cv_views"("cv_id", "device");

-- CreateIndex
CREATE INDEX "cvs_user_id_idx" ON "cvs"("user_id");

-- AddForeignKey
ALTER TABLE "user_identities" ADD CONSTRAINT "user_identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cvs" ADD CONSTRAINT "cvs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cvs" ADD CONSTRAINT "cvs_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_views" ADD CONSTRAINT "cv_views_cv_id_fkey" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_feedbacks" ADD CONSTRAINT "cv_feedbacks_cv_id_fkey" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_draft_cvs" ADD CONSTRAINT "ai_draft_cvs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_draft_cvs" ADD CONSTRAINT "ai_draft_cvs_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
