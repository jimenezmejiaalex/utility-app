/*
  Warnings:

  - You are about to drop the column `budgetId` on the `Account` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_budgetId_fkey";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "budgetId";

-- AlterTable
ALTER TABLE "BankAccount" ADD COLUMN     "budgetId" TEXT;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE SET NULL ON UPDATE CASCADE;
