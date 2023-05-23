import CategoryForm from '@/components/CategoryForm'
import Layout from '@/components/Layout'
import LoadingComponent from '@/components/Loading'
import { CategoryFormData } from '@/interfaces'
import Login from '@/pages/login'
import { Heading, Stack } from '@chakra-ui/layout'
import { Type } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'

type AddCategoryProps = {
    types: Array<Type>
}

const addCategory: React.FC<AddCategoryProps> = ({ types }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { data: session, status } = useSession()

    if (status === 'loading') {
        return <LoadingComponent />
    }

    if (!session) {
        return <Login />
    }

    const handleOnSubmit = async (category: CategoryFormData) => {
        setIsLoading(true)
        console.log(category)
        const response = await fetch('/api/category', {
            method: 'POST',
            body: JSON.stringify(category),
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

export const getServerSideProps: GetServerSideProps<AddCategoryProps> = async (
    ctx
) => {
    const types = [Type.Expense, Type.Income]
    return {
        props: {
            types,
        },
    }
}

export default addCategory
