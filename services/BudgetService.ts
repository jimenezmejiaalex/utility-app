import { BudgetInput } from '@/interfaces';
import { BudgetDB } from '@/services/DBService';
import { Budget } from '@prisma/client';
import { AccountService } from './AccountService';
import { CategoryService } from './CategoryService';

export class BudgetService {
    private accountService = new AccountService();
    private categoryService = new CategoryService();

    async addBudget(budget: BudgetInput): Promise<Budget> {
        try {
            const categories = await this.categoryService
                .getCategoriesByIds(
                    budget.categories.map(category => parseInt(category.value.toString()))
                );
            const accounts = await this.accountService
                .getAccountsByIds(
                    budget.accounts.map(account => parseInt(account.value.toString()))
                );


            const response = await BudgetDB.create({
                data: {
                    name: budget.name,
                    amount: budget.amount,
                    currency: budget.currency,
                    duration: {
                        create: {
                            createdAt: new Date(budget.startDate),
                            finishAt: new Date(budget.endDate)
                        }
                    },
                    accounts: {
                        connect: accounts
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

    async updateBudget(budget: BudgetInput, id: number): Promise<Budget> {
        try {
            const categories = await this.categoryService
                .getCategoriesByIds(
                    budget.categories.map(category => parseInt(category.value.toString()))
                );
            const accounts = await this.accountService
                .getAccountsByIds(
                    budget.accounts.map(account => parseInt(account.value.toString()))
                );

            const response = await BudgetDB.update({
                where: {
                    budgetId: id
                },
                data: {
                    name: budget.name,
                    amount: budget.amount,
                    duration: {
                        create: {
                            createdAt: new Date(budget.startDate),
                            finishAt: new Date(budget.endDate)
                        }
                    },
                    accounts: {
                        set: accounts,
                    },
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

    async deleteBudget(id: number): Promise<Budget> {
        try {
            const response = await BudgetDB.delete({
                where: {
                    budgetId: id
                }
            });

            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getBudgets(): Promise<Array<Budget>> {
        try {
            const response = await BudgetDB.findMany({
                select: {
                    id: true,
                    budgetId: true,
                    amount: true,
                    name: true,
                    categories: true,
                    accounts: true,
                    duration: true,
                    durationId: true,
                    currency: true
                }
            });

            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getBudgetById(id: number) {
        try {
            const response = await BudgetDB.findFirst({
                where: {
                    budgetId: id
                },
                select: {
                    id: true,
                    budgetId: true,
                    amount: true,
                    name: true,
                    categories: {
                        select: {
                            name: true,
                            categoryId: true
                        }
                    },
                    accounts: {
                        select: {
                            name: true,
                            accountId: true
                        }
                    },
                    duration: true,
                    currency: true
                }
            });

            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}