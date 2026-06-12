-- DropIndex
DROP INDEX "cv_views_visitor_id_idx";

-- CreateIndex
CREATE INDEX "cv_views_cv_id_visitor_id_idx" ON "cv_views"("cv_id", "visitor_id");

-- CreateIndex
CREATE INDEX "cv_views_cv_id_country_idx" ON "cv_views"("cv_id", "country");

-- CreateIndex
CREATE INDEX "cv_views_cv_id_city_idx" ON "cv_views"("cv_id", "city");

-- CreateIndex
CREATE INDEX "cv_views_cv_id_device_idx" ON "cv_views"("cv_id", "device");
