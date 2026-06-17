-- CreateTable
CREATE TABLE "CvFeedback" (
    "id" TEXT NOT NULL,
    "cv_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CvFeedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CvFeedback" ADD CONSTRAINT "CvFeedback_cv_id_fkey" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
