import SidebarWithHeader from '@/components/Layout'
import LoadingComponent from '@/components/Loading'
import PieCartComponent from '@/components/PieChart'
import { BudgetService } from '@/services/server-services/BudgetService'
import { redirectToLogin } from '@/utils/Constants'
import { Box, Heading, Spinner } from '@chakra-ui/react'
import { Currency } from '@prisma/client'
import { getSession, useSession } from 'next-auth/react'
import { useState } from 'react'
import Login from './login'

const IndexPage = ({ budgets, currencies }) => {
    const { data: session, status } = useSession()
    const [isLoading, setIsLoading] = useState(false)

    if (status === 'loading') {
        return <LoadingComponent />
    }

    if (!session) {
        return <Login />
    }

    return (
        <>
            <SidebarWithHeader title="Home Page">
                <Box
                    position="relative"
                    maxW="md"
                    borderWidth="1px"
                    borderRadius="lg"
                >
                    <Box p={4}>
                        <Heading as="h2" m={4}>
                            Budget's expenses
                        </Heading>
                    </Box>
                    <Box p={4} opacity={isLoading ? '0.1' : 1}>
                        <PieCartComponent
                            isLoading={isLoading}
                            currencies={currencies}
                            setLoading={setIsLoading}
                            budgets={budgets}
                        />
                    </Box>
                    <Box hidden={!isLoading}>
                        <Spinner
                            position="absolute"
                            left="40%"
                            top="40%"
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color="blue.500"
                            size="xl"
                        />
                    </Box>
                </Box>
            </SidebarWithHeader>
        </>
    )
}

export const getServerSideProps = async (ctx) => {
    const session = await getSession(ctx)
    if (!session) {
        return redirectToLogin
    }
    const budgetService = new BudgetService()
    const currencies = [Currency.CRC, Currency.USD]
    const budgets = await budgetService.getBudgets(session.user)
    return {
        props: {
            currencies,
            budgets: budgets.map((budget) => ({
                name: budget.name,
                budgetId: budget.budgetId,
            })),
        },
    }
}

export default IndexPage
