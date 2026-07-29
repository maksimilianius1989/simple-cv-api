/*
  Warnings:

  - A unique constraint covering the columns `[order_reference]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "payments_order_reference_key" ON "payments"("order_reference");
