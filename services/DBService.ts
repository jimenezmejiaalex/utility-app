import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()


export const BankAccountDB = prisma.bankAccount
export const BudgetDB = prisma.budget;
export const CategoryDB = prisma.category;
export const UserDB = prisma.user;
