import CategoryList from '@/components/CategoryList'
import Layout from '@/components/Layout'
import LoadingComponent from '@/components/Loading'
import { CategoryItem } from '@/interfaces'
import { CategoryService } from '@/services/CategoryService'
import { Box, IconButton } from '@chakra-ui/react'
import { getSession, useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import Login from '../login'

type CategoryProps = {
    categories: Array<CategoryItem>
}

const Category: React.FC<CategoryProps> = ({ categories }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [categoriesState, setCategoriesState] = useState(categories)

    const { data: session, status } = useSession()

    console.log(session)

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
        setCategoriesState([
            ...categoriesState.filter((account) => account.categoryId !== id),
        ])
        setIsLoading(false)
    }

    return (
        <Layout title="Categories">
            <CategoryList
                onDeleteAction={onDeleteAction}
                categories={categoriesState}
            />
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
        return {
            redirect: {
                destination: '/login',
            },
        }
    }
    const categoryService = new CategoryService()
    const categories = await categoryService.getCategories(session.user)

    console.log(categories)
    return {
        props: {
            categories,
        },
    }
}

export default Category
