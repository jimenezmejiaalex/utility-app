import BankAccountForm from '@/components/BankAccountForm'
import Layout from '@/components/Layout'
import LoadingComponent from '@/components/Loading'
import { AccountFormData } from '@/interfaces'
import Login from '@/pages/login'
import { AccountService } from '@/services/server-services/AccountService'
import { UserService } from '@/services/server-services/UserService'
import { redirectToLogin } from '@/utils/Constants'
import { Heading, Stack } from '@chakra-ui/react'
import { Currency } from '@prisma/client'
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'

const currency = [Currency.CRC, Currency.USD]

const Account = ({ users, account }) => {
    const router = useRouter()
    const id = router.query?.id

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

        const response = await fetch(`/api/account/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(bankAccount),
        })

        const data = await response.json()

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

export const getServerSideProps = async (ctx) => {
    const session = await getSession(ctx)
    if (!session) {
        return redirectToLogin
    }
    const id = ctx.params.id

    const userService = new UserService()
    const accountService = new AccountService()
    const users = await userService.getUsers(session.user, true)
    const account = await accountService.getBankAccountById(
        parseInt(id.toString()),
        session.user
    )
    const accountProp: AccountFormData = {
        name: account.name,
        currency: account.currency,
        amount: account.amount.toNumber(),
        email: account.User.email,
    }

    return {
        props: {
            users,
            account: accountProp,
        },
    }
}

export default Account
