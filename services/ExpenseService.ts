import { ExpenseInput } from '@/interfaces';
import { ExpenseDB } from '@/services/DBService';
import { Expense } from '@prisma/client';
import { BudgetService } from './BudgetService';

export class ExpenseService {
    private budgetService = new BudgetService();

    async addExpense(expense: ExpenseInput): Promise<Expense> {
        try {
            const response = await ExpenseDB.create({
                data: {
                    name: expense.name,
                    currency: expense.currency,
                    amount: expense.amount,
                    createdAt: new Date(expense.createdAt),
                    budget: {
                        connect: {
                            budgetId: parseInt(expense.budgetId)
                        }
                    }
                }
            });

            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async updateExpense(expense: ExpenseInput, id: number): Promise<Expense> {
        try {
            const budget = await this.budgetService.getBudgetById(parseInt(expense.budgetId));
            const response = await ExpenseDB.update({
                where: {
                    expenseId: id
                },
                data: {
                    currency: expense.currency,
                    amount: expense.amount,
                    createdAt: new Date(expense.createdAt),
                    budgetId: budget.id
                }
            });

            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async deleteExpense(id: number): Promise<Expense> {
        try {
            const response = await ExpenseDB.delete({
                where: {
                    expenseId: id
                }
            });

            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getExpenses(): Promise<Array<Omit<Expense, "budgetId">>> {
        try {
            const response = await ExpenseDB.findMany({
                select: {
                    id: true,
                    expenseId: true,
                    name: true,
                    currency: true,
                    amount: true,
                    createdAt: true,
                    budget: {
                        select: {
                            budgetId: true,
                            name: true
                        }
                    },
                }
            });

            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getExpenseById(id: number) {
        try {
            const response = await ExpenseDB.findFirst({
                where: {
                    expenseId: id
                },
                select: {
                    id: true,
                    expenseId: true,
                    name: true,
                    currency: true,
                    amount: true,
                    createdAt: true,
                    budget: {
                        select: {
                            budgetId: true,
                            name: true
                        }
                    },
                }
            });

            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}