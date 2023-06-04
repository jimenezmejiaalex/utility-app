import BudgetList from '@/components/BudgetList'
import Layout from '@/components/Layout'
import LoadingComponent from '@/components/Loading'
import { BudgetItem } from '@/interfaces'
import Login from '@/pages/login'
import { BudgetService } from '@/services/server-services/BudgetService'
import { redirectToLogin } from '@/utils/Constants'
import { Stack } from '@chakra-ui/layout'
import { Box, IconButton, Text } from '@chakra-ui/react'
import { getSession, useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'

type BudgetProps = {
    budgets: Array<BudgetItem>
}

const Budget: React.FC<BudgetProps> = ({ budgets }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [budgetsState, setBudgetsState] = useState(budgets)
    const { data: session, status } = useSession()
    const onDeleteAction = async (id: number) => {
        setIsLoading(true)
        const response = await fetch(`/api/budget/${id}`, {
            method: 'DELETE',
        })
        const data = await response.json()

        setBudgetsState([
            ...budgetsState.filter((budget) => budget.budgetId !== id),
        ])
        setIsLoading(false)
    }

    if (status === 'loading') {
        return <LoadingComponent />
    }

    if (!session) {
        return <Login />
    }
    return (
        <Layout title="Budgets">
            {budgetsState.length > 0 ? (
                <BudgetList
                    onDeleteAction={onDeleteAction}
                    budgets={budgetsState}
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
                <Link href="/budget/add">
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
    const budgetService = new BudgetService()
    const budgets = await budgetService.getBudgets(session.user)
    return {
        props: {
            budgets: budgets.map((budget) => ({
                budgetId: budget.budgetId,
                currency: budget.currency,
                name: budget.name,
                amountNumber: budget.amount.toNumber(),
            })),
        },
    }
}

export default Budget
