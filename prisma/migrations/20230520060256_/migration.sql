/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Budget` table. All the data in the column will be lost.
  - The `categoryId` column on the `Category` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `_BudgetToCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BudgetToCategory" DROP CONSTRAINT "_BudgetToCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_BudgetToCategory" DROP CONSTRAINT "_BudgetToCategory_B_fkey";

-- AlterTable
ALTER TABLE "BankAccount" ADD COLUMN     "accountId" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "categoryId",
ADD COLUMN     "budgetId" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "categoryId",
ADD COLUMN     "categoryId" SERIAL NOT NULL;

-- DropTable
DROP TABLE "_BudgetToCategory";

-- CreateTable
CREATE TABLE "CategoriesOnBudget" (
    "budgetId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "CategoriesOnBudget_pkey" PRIMARY KEY ("budgetId","categoryId")
);

-- AddForeignKey
ALTER TABLE "CategoriesOnBudget" ADD CONSTRAINT "CategoriesOnBudget_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnBudget" ADD CONSTRAINT "CategoriesOnBudget_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
