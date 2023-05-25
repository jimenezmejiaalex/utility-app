import ExpenseForm from '@/components/ExpenseForm'
import Layout from '@/components/Layout'
import LoadingComponent from '@/components/Loading'
import { BudgetType, ExpenseFormData } from '@/interfaces'
import Login from '@/pages/login'
import { BudgetService } from '@/services/BudgetService'
import { ExpenseService } from '@/services/ExpenseService'
import { Heading, Stack } from '@chakra-ui/layout'
import { Currency } from '@prisma/client'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { getDate } from 'utils/DateUtils'

type ExpenseProps = {
    budgets: Array<BudgetType>
    currencies: Array<Currency>
    expense: ExpenseFormData
}

const Expense: React.FC<ExpenseProps> = ({ budgets, currencies, expense }) => {
    console.log('budgets', budgets)
    console.log('currencies', currencies)
    console.log('expense', expense)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { data: session, status } = useSession()
    const router = useRouter()
    const id = router.query?.id

    if (status === 'loading') {
        return <LoadingComponent />
    }

    if (!session) {
        return <Login />
    }

    const handleOnSubmit = async (expense: ExpenseFormData) => {
        setIsLoading(true)
        console.log(expense)
        const response = await fetch(`/api/expense/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(expense),
        })

        const data = await response.json()
        console.log(data)
        setIsLoading(false)
    }

    return (
        <>
            <Layout title="Update Expense">
                <Stack spacing={6}>
                    <Heading m={4}>Edit Expense</Heading>
                    <ExpenseForm
                        isLoading={isLoading}
                        budgets={budgets}
                        currencies={currencies}
                        onSubmit={handleOnSubmit}
                        defaultData={expense}
                    />
                </Stack>
            </Layout>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const expenseService = new ExpenseService()
    const expenses = await expenseService.getExpenses()
    return {
        paths: expenses.map((e) => ({
            params: { id: e.expenseId.toString() },
        })),
        fallback: true,
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const id = ctx.params?.id

    const budgetService = new BudgetService()
    const expenseService = new ExpenseService()

    const budgetList = await budgetService.getBudgets()

    const expenseObj = await expenseService.getExpenseById(
        parseInt(id.toString())
    )

    const expense: ExpenseFormData = {
        name: expenseObj.name,
        currency: expenseObj.currency,
        amount: expenseObj.amount.toNumber(),
        createdAt: getDate(expenseObj.createdAt.toString()),
        budgetId: expenseObj.budget.budgetId.toString(),
    }

    const budgets: Array<BudgetType> =
        budgetList.length === 0
            ? []
            : budgetList.map((budget) => ({
                  budgetId: budget.budgetId,
                  name: budget.name,
              }))

    const currencies = [Currency.CRC, Currency.USD]
    return {
        props: {
            budgets,
            currencies,
            expense,
        },
        revalidate: 10,
    }
}

export default Expense
