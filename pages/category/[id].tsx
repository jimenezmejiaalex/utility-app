import CategoryForm from '@/components/CategoryForm'
import Layout from '@/components/Layout'
import LoadingComponent from '@/components/Loading'
import { CategoryFormData } from '@/interfaces'
import Login from '@/pages/login'
import { CategoryService } from '@/services/server-services/CategoryService'
import { Heading, Stack } from '@chakra-ui/layout'
import { Type } from '@prisma/client'
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

type AddCategoryProps = {
    types: Array<Type>
    data: CategoryFormData
}

const addCategory: React.FC<AddCategoryProps> = ({ data, types }) => {
    const router = useRouter()
    const id = router?.query?.id
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

        await fetch(`/api/category/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(category),
        })

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

export const getServerSideProps = async (ctx) => {
    const session = await getSession(ctx)
    const id = ctx.params?.id
    const categoryService = new CategoryService()
    const types = [Type.Expense, Type.Income]
    const category = await categoryService.getCategory(
        parseInt(id.toString()),
        session.user
    )

    if (!category) {
        return {
            redirect: {
                destination: '/category',
            },
        }
    }

    return {
        props: {
            types,
            data: category,
        },
    }
}

export default addCategory
