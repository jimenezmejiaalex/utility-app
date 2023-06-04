import { ExpenseInput, UserSession } from '@/interfaces'
import { ExpenseDB } from '@/services/server-services/DBService'
import { Budget, Currency, Expense } from '@prisma/client'
import { BudgetService } from './BudgetService'
import { CategoryService } from './CategoryService'
import { CurrencyService } from './CurrencyService'

export class ExpenseService {
    private budgetService = new BudgetService()
    private categoryService = new CategoryService()
    private currencyService = new CurrencyService()

    async addExpense(
        expense: ExpenseInput,
        userSession: UserSession
    ): Promise<Expense> {
        try {
            const categories = await this.categoryService.getCategoriesByIds(
                expense.categories.map((category) =>
                    parseInt(category.value.toString())
                )
            )

            return await ExpenseDB.create({
                data: {
                    name: expense.name,
                    currency: expense.currency,
                    amount: expense.amount,
                    createdAt: new Date(expense.createdAt),
                    budget: {
                        connect: {
                            budgetId: parseInt(expense.budgetId),
                        },
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

    async updateExpense(
        expense: ExpenseInput,
        id: number,
        userSession: UserSession
    ): Promise<Expense> {
        try {
            const categories = await this.categoryService.getCategoriesByIds(
                expense.categories.map((category) =>
                    parseInt(category.value.toString())
                )
            )

            const budget = await this.budgetService.getBudgetById(
                parseInt(expense.budgetId),
                userSession
            )
            return await ExpenseDB.update({
                where: {
                    expenseId: id,
                },
                data: {
                    currency: expense.currency,
                    amount: expense.amount,
                    createdAt: new Date(expense.createdAt),
                    budgetId: budget.id,
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

    async deleteExpense(id: number): Promise<Expense> {
        try {
            return await ExpenseDB.delete({
                where: {
                    expenseId: id,
                },
            })
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async getExpenses(
        userSession: UserSession
    ): Promise<Array<Omit<Expense, 'budgetId' | 'userId'>>> {
        try {
            return await ExpenseDB.findMany({
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
                    expenseId: true,
                    name: true,
                    currency: true,
                    amount: true,
                    createdAt: true,
                    budget: {
                        select: {
                            budgetId: true,
                            name: true,
                        },
                    },
                },
            })
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async getExpenseById(id: number, userSession: UserSession) {
        try {
            const response = await ExpenseDB.findFirst({
                where: {
                    expenseId: id,
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
                            name: true,
                        },
                    },
                    categories: {
                        select: {
                            name: true,
                            categoryId: true,
                        },
                    },
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

    async getExpenseByBudgetByMonthAndYear(
        budgetId: number,
        from: string,
        to: string
    ) {
        try {
            return await ExpenseDB.findMany({
                where: {
                    budget: {
                        budgetId: budgetId,
                    },
                    createdAt: {
                        gte: new Date(from),
                        lt: new Date(to),
                    },
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
                        },
                    },
                },
            })
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async getExpensesByCategory(
        budgetId: number,
        from: string,
        to: string,
        currency: Currency,
        userSession: UserSession
    ) {
        const budget = await this.budgetService.getBudgetById(
            parseInt(budgetId.toString()),
            userSession
        )
        const expenses = await this.getExpenseByBudgetByMonthAndYear(
            parseInt(budgetId.toString()),
            from.toString(),
            to.toString()
        )
        const budgetResponse: Pick<
            Budget,
            'amount' | 'currency' | 'name' | 'budgetId'
        > = {
            name: budget.name,
            budgetId: budget.budgetId,
            amount: budget.amount,
            currency: budget.currency,
        }

        const categoriesByExpense = {}
        let amount

        for (const expense of expenses) {
            for (const category of expense.categories) {
                amount =
                    currency !== expense.currency
                        ? await this.currencyService.convert(
                              expense.currency,
                              currency,
                              expense.amount.toNumber()
                          )
                        : expense.amount

                if (!categoriesByExpense[category.name]) {
                    categoriesByExpense[category.name] =
                        parseFloat(amount).toString()
                } else {
                    categoriesByExpense[category.name] = (
                        parseFloat(categoriesByExpense[category.name]) +
                        parseFloat(amount)
                    ).toString()
                }
            }
        }

        return {
            expenses,
            budget: budgetResponse,
            categoriesByExpense: Object.entries(categoriesByExpense).map(
                ([key, value]) => ({ name: key, value: value })
            ),
        }
    }
}
