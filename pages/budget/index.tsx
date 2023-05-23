import BudgetList from '@/components/BudgetList'
import Layout from '@/components/Layout'
import LoadingComponent from '@/components/Loading'
import { BudgetItem } from '@/interfaces'
import { BudgetService } from '@/services/BudgetService'
import { Box, IconButton } from '@chakra-ui/react'
import Link from 'next/link'
import { GetStaticProps } from 'next/types'
import React, { useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'

type BudgetProps = {
    budgets: Array<BudgetItem>
}

const Budget: React.FC<BudgetProps> = ({ budgets }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [budgetsState, setBudgetsState] = useState(budgets)
    const onDeleteAction = async (id: number) => {
        setIsLoading(true)
        const response = await fetch(`/api/budget/${id}`, {
            method: 'DELETE',
        })
        const data = await response.json()
        console.log(data)
        setBudgetsState([
            ...budgetsState.filter((budget) => budget.budgetId !== id),
        ])
        setIsLoading(false)
    }
    if (isLoading) {
        return <LoadingComponent />
    }
    return (
        <Layout title="Budgets">
            <BudgetList
                onDeleteAction={onDeleteAction}
                budgets={budgetsState}
            />
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

export const getStaticProps: GetStaticProps = async (ctx) => {
    const budgetService = new BudgetService()
    const budgets = await budgetService.getBudgets()
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
