import { ExpenseInput } from '@/interfaces';
import { ExpenseDB } from '@/services/DBService';
import { Budget, Currency, Expense } from '@prisma/client';
import { BudgetService } from './BudgetService';
import { CategoryService } from './CategoryService';
import { CurrencyService } from './CurrencyService';

export class ExpenseService {
    private budgetService = new BudgetService();
    private categoryService = new CategoryService();
    private currencyService = new CurrencyService();

    async addExpense(expense: ExpenseInput): Promise<Expense> {
        try {
            const categories = await this.categoryService
                .getCategoriesByIds(
                    expense.categories.map(category => parseInt(category.value.toString()))
                );

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
                    },
                    categories: {
                        connect: categories
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
            const categories = await this.categoryService
                .getCategoriesByIds(
                    expense.categories.map(category => parseInt(category.value.toString()))
                );

            const budget = await this.budgetService.getBudgetById(parseInt(expense.budgetId));
            const response = await ExpenseDB.update({
                where: {
                    expenseId: id
                },
                data: {
                    currency: expense.currency,
                    amount: expense.amount,
                    createdAt: new Date(expense.createdAt),
                    budgetId: budget.id,
                    categories: {
                        set: categories
                    }
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
                    categories: {
                        select: {
                            name: true,
                            categoryId: true,
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

    async getExpenseByBudgetByMonthAndYear(budgetId: number, from: string, to: string) {
        try {
            const response = await ExpenseDB.findMany({
                where: {
                    budget: {
                        budgetId: budgetId
                    },
                    createdAt: {
                        gte: new Date(from),
                        lt: new Date(to)
                    }
                },
                orderBy: {
                    createdAt: 'asc',
                },
                select: {
                    id: true,
                    expenseId: true,
                    name: true,
                    currency: true,
                    amount: true,
                    createdAt: true,
                    categories: {
                        select: {
                            name: true,
                            categoryId: true,
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

    async getExpensesByCategory(budgetId: number, from: string, to: string, currency: Currency) {
        const budget = await this.budgetService.getBudgetById(parseInt(budgetId.toString()));
        const expenses = await this.getExpenseByBudgetByMonthAndYear(
            parseInt(budgetId.toString()), from.toString(), to.toString()
        );
        const budgetResponse: Pick<Budget, "amount" | "currency" | "name" | "budgetId"> = {
            name: budget.name,
            budgetId: budget.budgetId,
            amount: budget.amount,
            currency: budget.currency
        };

        const categoriesByExpense = {};
        let amount;

        await expenses.forEach(async expense => {
            await expense.categories.forEach(async category => {
                amount = currency !== expense.currency ?
                    await this.currencyService
                        .convert(expense.currency, currency, expense.amount.toNumber()) :
                    expense.amount;

                if (!categoriesByExpense[category.name]) {
                    categoriesByExpense[category.name] = parseFloat(amount).toString();
                } else {
                    categoriesByExpense[category.name] =
                        (parseFloat(categoriesByExpense[category.name]) + parseFloat(amount)).toString()
                }

            })
        })

        return {
            expenses,
            budget: budgetResponse,
            categoriesByExpense: Object.entries(categoriesByExpense)
                .map(([key, value]) => ({ name: key, value: value }))
        }
    }
}