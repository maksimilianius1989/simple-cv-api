/*
  Warnings:

  - A unique constraint covering the columns `[publick_slug]` on the table `user_cv_data` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_cv_data_publick_slug_key" ON "user_cv_data"("publick_slug");
