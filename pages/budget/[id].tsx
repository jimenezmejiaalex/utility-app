import BudgetForm from '@/components/BudgetForm'
import Layout from '@/components/Layout'
import LoadingComponent from '@/components/Loading'
import { BankAccountType, BudgetFormData, CategoryType } from '@/interfaces'
import Login from '@/pages/login'
import { AccountService } from '@/services/server-services/AccountService'
import { BudgetService } from '@/services/server-services/BudgetService'
import { CategoryService } from '@/services/server-services/CategoryService'
import { redirectToLogin } from '@/utils/Constants'
import { Heading, Stack } from '@chakra-ui/layout'
import { Currency } from '@prisma/client'
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

type BudgetProps = {
    accounts: Array<BankAccountType>
    categories: Array<CategoryType>
    currencies: Array<Currency>
    budget: BudgetFormData
}

const Budget: React.FC<BudgetProps> = ({
    accounts,
    categories,
    currencies,
    budget,
}) => {
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

    const handleOnSubmit = async (budget: BudgetFormData) => {
        setIsLoading(true)

        const response = await fetch(`/api/budget/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(budget),
        })

        const data = await response.json()

        setIsLoading(false)
    }

    return (
        <>
            <Layout title="Add Budget">
                <Stack spacing={6}>
                    <Heading m={4}>Edit Budget</Heading>
                    <BudgetForm
                        defaultData={budget}
                        isLoading={isLoading}
                        categories={categories}
                        accounts={accounts}
                        currencies={currencies}
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
    const id = ctx.params?.id

    const budgetService = new BudgetService()
    const accountService = new AccountService()
    const categoryService = new CategoryService()
    const accountList = await accountService.getBankAccounts(session.user)
    const categoryList = await categoryService.getCategories(session.user)

    const budgetObj = await budgetService.getBudgetById(
        parseInt(id.toString()),
        session.user
    )

    const budget: BudgetFormData = {
        name: budgetObj.name,
        amount: budgetObj.amount.toNumber(),
        startDate: new Date(budgetObj.duration.createdAt.toString())
            .toISOString()
            .substring(
                0,
                new Date(budgetObj.duration.createdAt.toString())
                    .toISOString()
                    .indexOf('T') + 6
            ),
        endDate: new Date(budgetObj.duration.finishAt.toString())
            .toISOString()
            .substring(
                0,
                new Date(budgetObj.duration.finishAt.toString())
                    .toISOString()
                    .indexOf('T') + 6
            ),
        accounts: budgetObj.accounts.map((account) => ({
            label: account.name,
            value: account.accountId.toString(),
        })),
        categories: budgetObj.categories.map((category) => ({
            label: category.name,
            value: category.categoryId.toString(),
        })),
        currency: budgetObj.currency,
    }

    const accounts: Array<BankAccountType> = accountList.map((account) => ({
        accountId: account.accountId,
        name: account.name,
    }))

    const categories: Array<CategoryType> = categoryList.map((category) => ({
        categoryId: category.categoryId,
        name: category.name,
    }))

    const currencies = [Currency.CRC, Currency.USD]
    return {
        props: {
            accounts,
            categories,
            currencies,
            budget,
        },
    }
}

export default Budget
