/*
  Warnings:

  - You are about to drop the `CvFeedback` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CvFeedback" DROP CONSTRAINT "CvFeedback_cv_id_fkey";

-- DropTable
DROP TABLE "CvFeedback";

-- CreateTable
CREATE TABLE "cv_feedbacks" (
    "id" TEXT NOT NULL,
    "cv_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cv_feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cv_feedbacks_email_idx" ON "cv_feedbacks"("email");

-- AddForeignKey
ALTER TABLE "cv_feedbacks" ADD CONSTRAINT "cv_feedbacks_cv_id_fkey" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
