import ExpenseList from '@/components/ExpenseList'
import Layout from '@/components/Layout'
import LoadingComponent from '@/components/Loading'
import { ExpenseItem } from '@/interfaces'
import { ExpenseService } from '@/services/ExpenseService'
import { Box, IconButton } from '@chakra-ui/react'
import Link from 'next/link'
import { GetStaticProps } from 'next/types'
import React, { useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'

type ExpenseProps = {
    expenses: Array<ExpenseItem>
}

const Budget: React.FC<ExpenseProps> = ({ expenses }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [expensesState, setExpensesState] = useState(expenses)
    const onDeleteAction = async (id: number) => {
        setIsLoading(true)
        const response = await fetch(`/api/expense/${id}`, {
            method: 'DELETE',
        })
        const data = await response.json()
        setExpensesState([
            ...expensesState.filter((expense) => expense.expenseId !== id),
        ])
        setIsLoading(false)
    }
    if (isLoading) {
        return <LoadingComponent />
    }
    return (
        <Layout title="Expenses">
            <ExpenseList
                onDeleteAction={onDeleteAction}
                expenses={expensesState}
            />
            <Box
                position="fixed"
                bottom="80px"
                right={['16px', '14px']}
                zIndex={1}
            >
                <Link href="/expense/add">
                    <IconButton
                        variant="solid"
                        colorScheme="red"
                        aria-label="Call Sage"
                        size="lg"
                        rounded="full"
                        icon={<AiOutlinePlus />}
                    />
                </Link>
            </Box>
        </Layout>
    )
}

export const getStaticProps: GetStaticProps<ExpenseProps> = async (ctx) => {
    const expenseService = new ExpenseService()
    const expenses = await expenseService.getExpenses()
    return {
        props: {
            expenses: expenses.map((expense) => ({
                expenseId: expense.expenseId,
                currency: expense.currency,
                name: expense.name,
                amountNumber: expense.amount.toNumber(),
            })),
        },
        revalidate: 10,
    }
}

export default Budget
