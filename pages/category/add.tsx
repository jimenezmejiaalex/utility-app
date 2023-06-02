import CategoryForm from '@/components/CategoryForm'
import Layout from '@/components/Layout'
import LoadingComponent from '@/components/Loading'
import { CategoryFormData } from '@/interfaces'
import Login from '@/pages/login'
import { Heading, Stack } from '@chakra-ui/layout'
import { Type } from '@prisma/client'
import { GetStaticProps } from 'next'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'

type AddCategoryProps = {
    types: Array<Type>
}

const addCategory: React.FC<AddCategoryProps> = ({ types }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { data: session, status } = useSession()

    console.log(session)

    if (status === 'loading') {
        return <LoadingComponent />
    }

    if (!session) {
        return <Login />
    }

    const handleOnSubmit = async (category: CategoryFormData) => {
        setIsLoading(true)

        const response = await fetch('/api/category', {
            method: 'POST',
            body: JSON.stringify(category),
        })

        const data = await response.json()

        setIsLoading(false)
    }

    return (
        <>
            <Layout title="Add Category">
                <Stack spacing={6}>
                    <Heading m={4}>Add Category</Heading>
                    <CategoryForm
                        isLoading={isLoading}
                        types={types}
                        onSubmit={handleOnSubmit}
                    />
                </Stack>
            </Layout>
        </>
    )
}

export const getStaticProps: GetStaticProps = (ctx) => {
    const types = [Type.Expense, Type.Income]
    return {
        props: {
            types,
        },
        revalidate: 10,
    }
}

export default addCategory
