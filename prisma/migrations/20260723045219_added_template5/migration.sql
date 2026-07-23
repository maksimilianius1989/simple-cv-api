-- DropForeignKey
ALTER TABLE "cvs" DROP CONSTRAINT "cvs_template_id_fkey";

-- AddForeignKey
ALTER TABLE "cvs" ADD CONSTRAINT "cvs_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
