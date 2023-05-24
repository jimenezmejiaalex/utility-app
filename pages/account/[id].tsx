import BankAccountForm from '@/components/BankAccountForm'
import Layout from '@/components/Layout'
import LoadingComponent from '@/components/Loading'
import { AccountFormData } from '@/interfaces'
import Login from '@/pages/login'
import { AccountService } from '@/services/AccountService'
import { UserService } from '@/services/UserService'
import { Heading, Stack } from '@chakra-ui/react'
import { Currency } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next/types'
import { useState } from 'react'

const currency = [Currency.CRC, Currency.USD]

const Account = ({ users, account }) => {
    console.log(account)
    const router = useRouter()
    const id = router.query?.id
    console.log(id)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { data: session, status } = useSession()

    if (status === 'loading') {
        return <LoadingComponent />
    }

    if (!session) {
        return <Login />
    }

    const handleOnSubmit = async (bankAccount: AccountFormData) => {
        setIsLoading(true)
        console.log(bankAccount, id)
        const response = await fetch(`/api/account/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(bankAccount),
        })

        const data = await response.json()
        console.log(data)
        setIsLoading(false)
    }

    return (
        <>
            <Layout title="Add Account">
                <Stack spacing={6}>
                    <Heading m={4}>Edit Account</Heading>
                    <BankAccountForm
                        defaultData={account}
                        isLoading={isLoading}
                        users={users}
                        currencies={currency}
                        onSubmit={handleOnSubmit}
                    />
                </Stack>
            </Layout>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const accountService = new AccountService()
    const accounts = await accountService.getBankAccounts()
    return {
        paths: accounts.map((c) => ({
            params: { id: c.accountId.toString() },
        })),
        fallback: true,
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const id = ctx.params.id
    console.log(id)
    const userService = new UserService()
    const accountService = new AccountService()
    const users = await userService.getUsers()
    const account = await accountService.getBankAccountById(
        parseInt(id.toString())
    )
    const accountProp: AccountFormData = {
        name: account.name,
        currency: account.currency,
        amount: account.amount.toNumber(),
        email: account.User.email,
    }
    console.log(account)
    return {
        props: {
            users,
            account: accountProp,
        },
        revalidate: 10,
    }
}

export default Account
