import CategoryList from '@/components/CategoryList'
import Layout from '@/components/Layout'
import LoadingComponent from '@/components/Loading'
import { CategoryItem } from '@/interfaces'
import { CategoryService } from '@/services/server-services/CategoryService'
import { redirectToLogin } from '@/utils/Constants'
import { Stack } from '@chakra-ui/layout'
import { Box, IconButton, Text } from '@chakra-ui/react'
import { getSession, useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import Login from '../login'

type CategoryProps = {
    categories: Array<CategoryItem>
}

const Category: React.FC<CategoryProps> = ({ categories }) => {
    const [_, setIsLoading] = useState<boolean>(false)
    const [categoriesState, setCategoriesState] = useState(categories)

    const { data: session, status } = useSession()

    if (status === 'loading') {
        return <LoadingComponent />
    }

    if (!session) {
        return <Login />
    }

    const onDeleteAction = async (id: number) => {
        setIsLoading(true)
        const response = await fetch(`/api/category/${id}`, {
            method: 'DELETE',
        })
        const data = await response.json()
        if (data) {
            setCategoriesState([
                ...categoriesState.filter(
                    (account) => account.categoryId !== id
                ),
            ])
        }

        setIsLoading(false)
    }

    return (
        <Layout title="Categories">
            {categories.length > 0 ? (
                <CategoryList
                    onDeleteAction={onDeleteAction}
                    categories={categoriesState}
                />
            ) : (
                <Stack spacing={3}>
                    <Text fontSize="lg">No Content</Text>
                </Stack>
            )}
            <Box
                position="fixed"
                bottom="80px"
                right={['16px', '14px']}
                zIndex={1}
            >
                <Link href="/category/add">
                    <IconButton
                        variant="solid"
                        colorScheme="red"
                        aria-label="Call Sage"
                        size="lg"
                        rounded="full"
                        icon={<AiOutlinePlus />}
                    />
                </Link>
            </Box>
        </Layout>
    )
}

export const getServerSideProps = async (ctx) => {
    const session = await getSession(ctx)
    if (!session) {
        return redirectToLogin
    }
    const categoryService = new CategoryService()
    const categories = await categoryService.getCategories(session.user)

    return {
        props: {
            categories,
        },
    }
}

export default Category
