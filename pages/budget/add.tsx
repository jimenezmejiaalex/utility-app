import BudgetForm from '@/components/BudgetForm'
import Layout from '@/components/Layout'
import LoadingComponent from '@/components/Loading'
import { BankAccountType, BudgetFormData, CategoryType } from '@/interfaces'
import Login from '@/pages/login'
import { AccountService } from '@/services/AccountService'
import { CategoryService } from '@/services/CategoryService'
import { Heading, Stack } from '@chakra-ui/layout'
import { Currency } from '@prisma/client'
import { GetStaticProps } from 'next'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'

type AddBudgetProps = {
    accounts: Array<BankAccountType>
    categories: Array<CategoryType>
    currencies: Array<Currency>
}

const addBudget: React.FC<AddBudgetProps> = ({
    accounts,
    categories,
    currencies,
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { data: session, status } = useSession()

    if (status === 'loading') {
        return <LoadingComponent />
    }

    if (!session) {
        return <Login />
    }

    const handleOnSubmit = async (budget: BudgetFormData) => {
        setIsLoading(true)

        const response = await fetch('/api/budget', {
            method: 'POST',
            body: JSON.stringify(budget),
        })

        const data = await response.json()

        setIsLoading(false)
    }

    return (
        <>
            <Layout title="Add Budget">
                <Stack spacing={6}>
                    <Heading m={4}>Add Budget</Heading>
                    <BudgetForm
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

export const getStaticProps: GetStaticProps = async (ctx) => {
    const accountService = new AccountService()
    const categoryService = new CategoryService()
    const accountList = await accountService.getBankAccounts()
    const categoryList = await categoryService.getCategories()

    const accounts: Array<BankAccountType> =
        accountList.length === 0
            ? []
            : accountList.map((account) => ({
                  accountId: account.accountId,
                  name: account.name,
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
            accounts,
            categories,
            currencies,
        },
        revalidate: 10,
    }
}

export default addBudget
