/*
  Warnings:

  - A unique constraint covering the columns `[budgetId]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Budget_budgetId_key" ON "Budget"("budgetId");
