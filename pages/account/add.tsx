import BankAccountForm from '@/components/BankAccountForm'
import Layout from '@/components/Layout'
import LoadingComponent from '@/components/Loading'
import { AccountFormData } from '@/interfaces'
import Login from '@/pages/login'
import { UserService } from '@/services/UserService'
import { Heading, Stack } from '@chakra-ui/react'
import { Currency } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { GetStaticProps } from 'next/types'
import { useState } from 'react'

const currency = [Currency.CRC, Currency.USD]

const Account = ({ users }) => {
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
        console.log(bankAccount)
        const response = await fetch('/api/account', {
            method: 'POST',
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
                    <Heading m={4}>Add Account</Heading>
                    <BankAccountForm
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

export const getStaticProps: GetStaticProps = async (ctx) => {
    const userService = new UserService()
    const users = await userService.getUsers()
    return {
        props: {
            users,
        },
        revalidate: 10,
    }
}

export default Account
