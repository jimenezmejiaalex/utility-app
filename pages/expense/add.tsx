import ExpenseForm from '@/components/ExpenseForm'
import Layout from '@/components/Layout'
import LoadingComponent from '@/components/Loading'
import { BudgetType, CategoryType, ExpenseFormData } from '@/interfaces'
import Login from '@/pages/login'
import { BudgetService } from '@/services/BudgetService'
import { CategoryService } from '@/services/CategoryService'
import { Heading, Stack } from '@chakra-ui/layout'
import { Currency } from '@prisma/client'
import { GetStaticProps } from 'next'
import { useSession } from 'next-auth/react'
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

export const getStaticProps: GetStaticProps = async (ctx) => {
    const budgetService = new BudgetService()
    const categoryService = new CategoryService()

    const budgetList = await budgetService.getBudgets()
    const categoryList = await categoryService.getCategories()

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
        revalidate: 10,
    }
}

export default addExpense
