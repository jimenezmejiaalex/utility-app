import BankAccountForm from '@/components/BankAccountForm'
import Layout from '@/components/Layout'
import LoadingComponent from '@/components/Loading'
import { AccountFormData } from '@/interfaces'
import Login from '@/pages/login'
import { UserService } from '@/services/server-services/UserService'
import { redirectToLogin } from '@/utils/Constants'
import { Heading, Stack } from '@chakra-ui/react'
import { Currency } from '@prisma/client'
import { getSession, useSession } from 'next-auth/react'
import { useState } from 'react'

const Account = ({ users, currencies }) => {
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

        const response = await fetch('/api/account', {
            method: 'POST',
            body: JSON.stringify(bankAccount),
        })

        const data = await response.json()

        setIsLoading(false)
    }

    return (
        <>
            <Layout title="Add Account">
                <Stack spacing={6}>
                    <Heading m={4}>Add Account</Heading>
                    <BankAccountForm
                        isLoading={isLoading}
                        users={users}
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
    const userService = new UserService()
    const users = await userService.getUsers(session.user, true)

    const currencies = [Currency.CRC, Currency.USD]
    return {
        props: {
            users,
            currencies,
        },
    }
}

export default Account
