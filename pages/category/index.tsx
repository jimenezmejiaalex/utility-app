import CategoryList from '@/components/CategoryList'
import Layout from '@/components/Layout'
import LoadingComponent from '@/components/Loading'
import { CategoryItem } from '@/interfaces'
import { CategoryService } from '@/services/CategoryService'
import { Box, IconButton } from '@chakra-ui/react'
import Link from 'next/link'
import { GetStaticProps } from 'next/types'
import React, { useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'

type CategoryProps = {
    categories: Array<CategoryItem>
}

const Category: React.FC<CategoryProps> = ({ categories }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [categoriesState, setCategoriesState] = useState(categories)
    const onDeleteAction = async (id: number) => {
        setIsLoading(true)
        const response = await fetch(`/api/category/${id}`, {
            method: 'DELETE',
        })
        const data = await response.json()
        console.log(data)
        setCategoriesState([
            ...categoriesState.filter((account) => account.categoryId !== id),
        ])
        setIsLoading(false)
    }
    if (isLoading) {
        return <LoadingComponent />
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

export const getStaticProps: GetStaticProps = async (ctx) => {
    const categoryService = new CategoryService()
    const categories = await categoryService.getCategories()
    console.log(categories)
    return {
        props: {
            categories,
        },
        revalidate: 10,
    }
}

export default Category
