-- CreateTable
CREATE TABLE "user_cv_data" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "userSummary" TEXT NOT NULL,
    "jsonSummary" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_cv_data_pkey" PRIMARY KEY ("id")
);
