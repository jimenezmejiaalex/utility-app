import { BudgetInput, UserSession } from '@/interfaces'
import { BudgetDB } from '@/services/server-services/DBService'
import { Budget } from '@prisma/client'
import { AccountService } from './AccountService'
import { CategoryService } from './CategoryService'

export class BudgetService {
    private accountService = new AccountService()
    private categoryService = new CategoryService()

    async addBudget(
        budget: BudgetInput,
        userSession: UserSession
    ): Promise<Budget> {
        try {
            const categories = await this.categoryService.getCategoriesByIds(
                budget.categories.map((category) =>
                    parseInt(category.value.toString())
                )
            )
            const accounts = await this.accountService.getAccountsByIds(
                budget.accounts.map((account) =>
                    parseInt(account.value.toString())
                )
            )

            return await BudgetDB.create({
                data: {
                    name: budget.name,
                    amount: budget.amount,
                    currency: budget.currency,
                    duration: {
                        create: {
                            createdAt: new Date(budget.startDate),
                            finishAt: new Date(budget.endDate),
                        },
                    },
                    accounts: {
                        connect: accounts,
                    },
                    categories: {
                        connect: categories,
                    },
                    creator: {
                        connect: {
                            email: userSession.email,
                        },
                    },
                },
            })
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async updateBudget(budget: BudgetInput, id: number): Promise<Budget> {
        try {
            const categories = await this.categoryService.getCategoriesByIds(
                budget.categories.map((category) =>
                    parseInt(category.value.toString())
                )
            )
            const accounts = await this.accountService.getAccountsByIds(
                budget.accounts.map((account) =>
                    parseInt(account.value.toString())
                )
            )

            return await BudgetDB.update({
                where: {
                    budgetId: id,
                },
                data: {
                    name: budget.name,
                    amount: budget.amount,
                    duration: {
                        create: {
                            createdAt: new Date(budget.startDate),
                            finishAt: new Date(budget.endDate),
                        },
                    },
                    accounts: {
                        set: accounts,
                    },
                    categories: {
                        set: categories,
                    },
                },
            })
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async deleteBudget(id: number): Promise<Budget> {
        try {
            return await BudgetDB.delete({
                where: {
                    budgetId: id,
                },
            })
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async getBudgets(
        userSession: UserSession
    ): Promise<Array<Omit<Budget, 'userId'>>> {
        try {
            return await BudgetDB.findMany({
                where: {
                    OR: [
                        {
                            creator: {
                                email: userSession.email,
                            },
                        },
                        {
                            creator: {
                                users: {
                                    some: {
                                        email: userSession.email,
                                    },
                                },
                            },
                        },
                    ],
                },
                select: {
                    id: true,
                    budgetId: true,
                    amount: true,
                    name: true,
                    categories: true,
                    accounts: true,
                    duration: true,
                    durationId: true,
                    currency: true,
                },
            })
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async getBudgetById(id: number, userSession: UserSession) {
        try {
            const response = await BudgetDB.findFirst({
                where: {
                    budgetId: id,
                },
                select: {
                    id: true,
                    budgetId: true,
                    amount: true,
                    name: true,
                    categories: {
                        select: {
                            name: true,
                            categoryId: true,
                        },
                    },
                    accounts: {
                        select: {
                            name: true,
                            accountId: true,
                        },
                    },
                    duration: true,
                    currency: true,
                    creator: {
                        select: {
                            email: true,
                            users: {
                                select: {
                                    email: true,
                                },
                            },
                        },
                    },
                },
            })

            if (
                response.creator.email === userSession.email ||
                response.creator.users.some(
                    (user) => user.email === userSession.email
                )
            ) {
                return response
            }
            return null
        } catch (error) {
            console.error(error)
            return null
        }
    }
}
