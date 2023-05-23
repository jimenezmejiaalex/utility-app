/*
  Warnings:

  - You are about to drop the column `budgetId` on the `BankAccount` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BankAccount" DROP CONSTRAINT "BankAccount_budgetId_fkey";

-- AlterTable
ALTER TABLE "BankAccount" DROP COLUMN "budgetId";

-- CreateTable
CREATE TABLE "_BankAccountToBudget" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BankAccountToBudget_AB_unique" ON "_BankAccountToBudget"("A", "B");

-- CreateIndex
CREATE INDEX "_BankAccountToBudget_B_index" ON "_BankAccountToBudget"("B");

-- AddForeignKey
ALTER TABLE "_BankAccountToBudget" ADD CONSTRAINT "_BankAccountToBudget_A_fkey" FOREIGN KEY ("A") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BankAccountToBudget" ADD CONSTRAINT "_BankAccountToBudget_B_fkey" FOREIGN KEY ("B") REFERENCES "Budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
