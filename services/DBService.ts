import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()


export const ProductDB = prisma.product
export const ReminderDB = prisma.reminder;
export const UserDB = prisma.user;
