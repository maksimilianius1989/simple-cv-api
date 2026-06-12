-- CreateTable
CREATE TABLE "cv_views" (
    "id" TEXT NOT NULL,
    "cv_id" TEXT NOT NULL,
    "ip" TEXT,
    "country" TEXT,
    "country_code" TEXT,
    "city" TEXT,
    "user_agent" TEXT,
    "referer" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "device" TEXT,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cv_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cv_views_cv_id_idx" ON "cv_views"("cv_id");

-- CreateIndex
CREATE INDEX "cv_views_ip_idx" ON "cv_views"("ip");

-- AddForeignKey
ALTER TABLE "cv_views" ADD CONSTRAINT "cv_views_cv_id_fkey" FOREIGN KEY ("cv_id") REFERENCES "user_cv_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
