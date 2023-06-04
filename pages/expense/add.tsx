import ExpenseForm from '@/components/ExpenseForm'
import Layout from '@/components/Layout'
import LoadingComponent from '@/components/Loading'
import { BudgetType, CategoryType, ExpenseFormData } from '@/interfaces'
import Login from '@/pages/login'
import { BudgetService } from '@/services/server-services/BudgetService'
import { CategoryService } from '@/services/server-services/CategoryService'
import { redirectToLogin } from '@/utils/Constants'
import { Heading, Stack } from '@chakra-ui/layout'
import { Currency } from '@prisma/client'
import { getSession, useSession } from 'next-auth/react'
import React, { useState } from 'react'

type AddExpenseProps = {
    budgets: Array<BudgetType>
    currencies: Array<Currency>
    categories: Array<CategoryType>
}

const addExpense: React.FC<AddExpenseProps> = ({
    budgets,
    currencies,
    categories,
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { data: session, status } = useSession()

    if (status === 'loading') {
        return <LoadingComponent />
    }

    if (!session) {
        return <Login />
    }

    const handleOnSubmit = async (expense: ExpenseFormData) => {
        setIsLoading(true)
        const response = await fetch('/api/expense', {
            method: 'POST',
            body: JSON.stringify(expense),
        })

        const data = await response.json()
        setIsLoading(false)
    }

    return (
        <>
            <Layout title="Add Expense">
                <Stack spacing={6}>
                    <Heading m={4}>Add Expense</Heading>
                    <ExpenseForm
                        isLoading={isLoading}
                        budgets={budgets}
                        currencies={currencies}
                        categories={categories}
                        onSubmit={handleOnSubmit}
                    />
                </Stack>
            </Layout>
        </>
    )
}

export const getServerSideProps = async (ctx) => {
    const session = await getSession(ctx)
    if (!session) {
        return redirectToLogin
    }
    const budgetService = new BudgetService()
    const categoryService = new CategoryService()

    const budgetList = await budgetService.getBudgets(session.user)
    const categoryList = await categoryService.getCategories(session.user)

    const budgets: Array<BudgetType> =
        budgetList.length === 0
            ? []
            : budgetList.map((budget) => ({
                  budgetId: budget.budgetId,
                  name: budget.name,
              }))

    const categories: Array<CategoryType> =
        categoryList.length === 0
            ? []
            : categoryList.map((category) => ({
                  categoryId: category.categoryId,
                  name: category.name,
              }))

    const currencies = [Currency.CRC, Currency.USD]

    return {
        props: {
            budgets,
            currencies,
            categories,
        },
    }
}

export default addExpense
