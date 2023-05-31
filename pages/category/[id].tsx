import CategoryForm from '@/components/CategoryForm'
import Layout from '@/components/Layout'
import LoadingComponent from '@/components/Loading'
import { CategoryFormData } from '@/interfaces'
import Login from '@/pages/login'
import { CategoryService } from '@/services/CategoryService'
import { Heading, Stack } from '@chakra-ui/layout'
import { Type } from '@prisma/client'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

type AddCategoryProps = {
    types: Array<Type>
    data: CategoryFormData
}

const addCategory: React.FC<AddCategoryProps> = ({ types, data }) => {
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

    const handleOnSubmit = async (category: CategoryFormData) => {
        setIsLoading(true)

        const response = await fetch(`/api/category/${id}`, {
            method: 'PATCH',
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
                        defaultData={data}
                        isLoading={isLoading}
                        types={types}
                        onSubmit={handleOnSubmit}
                    />
                </Stack>
            </Layout>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const categoryService = new CategoryService()
    const categories = await categoryService.getCategories()
    return {
        paths: categories.map((c) => ({
            params: { id: c.categoryId.toString() },
        })),
        fallback: true,
    }
}
export const getStaticProps: GetStaticProps = async (ctx) => {
    const id = ctx.params?.id
    const categoryService = new CategoryService()
    const types = [Type.Expense, Type.Income]
    const category = await categoryService.getCategory(parseInt(id.toString()))
    return {
        props: {
            types,
            data: category,
        },
        revalidate: 10,
    }
}

export default addCategory
