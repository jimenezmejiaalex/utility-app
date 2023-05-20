import Layout from '@/components/Layout'
import LoadingComponent from '@/components/Loading'
import { AccountFormData } from '@/interfaces'
import { Heading, Stack } from '@chakra-ui/layout'
import { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import users from '../api/users'
import Login from '../login'

const addCategory = () => {
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
            <Layout title="Add Category">
                <Stack spacing={6}>
                    <Heading m={4}>Add Category</Heading>
                    <categoryForm
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    return {
        props: {},
    }
}

export default addCategory
