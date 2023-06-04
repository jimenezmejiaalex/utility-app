import ExpenseList from '@/components/ExpenseList'
import Layout from '@/components/Layout'
import LoadingComponent from '@/components/Loading'
import { ExpenseItem } from '@/interfaces'
import Login from '@/pages/login'
import { ExpenseService } from '@/services/server-services/ExpenseService'
import { redirectToLogin } from '@/utils/Constants'
import { Stack } from '@chakra-ui/layout'
import { Box, IconButton, Text } from '@chakra-ui/react'
import { getSession, useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'

type ExpenseProps = {
    expenses: Array<ExpenseItem>
}

const Budget: React.FC<ExpenseProps> = ({ expenses }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [expensesState, setExpensesState] = useState(expenses)

    const { data: session, status } = useSession()

    if (status === 'loading') {
        return <LoadingComponent />
    }

    if (!session) {
        return <Login />
    }
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

    return (
        <Layout title="Expenses">
            {expensesState.length > 0 ? (
                <ExpenseList
                    onDeleteAction={onDeleteAction}
                    expenses={expensesState}
                />
            ) : (
                <Stack spacing={3}>
                    <Text fontSize="lg">No Content</Text>
                </Stack>
            )}
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

export const getServerSideProps = async (ctx) => {
    const session = await getSession(ctx)
    if (!session) {
        return redirectToLogin
    }
    const expenseService = new ExpenseService()
    const expenses = await expenseService.getExpenses(session.user)
    return {
        props: {
            expenses: expenses.map((expense) => ({
                expenseId: expense.expenseId,
                currency: expense.currency,
                name: expense.name,
                amountNumber: expense.amount.toNumber(),
            })),
        },
    }
}

export default Budget
