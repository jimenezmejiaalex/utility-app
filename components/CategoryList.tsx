import { CategoryItem } from '@/interfaces'
import {
    IconButton,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Tfoot,
    Th,
    Thead,
    Tr,
} from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'

type CategoryListProps = {
    categories: Array<CategoryItem>
    onDeleteAction: (id: number) => void
}

const CategoryList: React.FC<CategoryListProps> = ({
    categories,
    onDeleteAction,
}) => {
    const handleOnDelete = (id) => {
        onDeleteAction(id)
    }
    return (
        <TableContainer>
            <Table variant="simple">
                <TableCaption>List of categories</TableCaption>
                <Thead>
                    <Tr>
                        <Th>Name</Th>
                        <Th>Type</Th>
                        <Th isNumeric>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {categories.map((category) => (
                        <Tr key={category.categoryId}>
                            <Td>{category.name}</Td>
                            <Td>{category.type}</Td>
                            <Td isNumeric>
                                <IconButton
                                    onClick={() =>
                                        handleOnDelete(category.categoryId)
                                    }
                                    variant="link"
                                    colorScheme="red"
                                    aria-label="Delete"
                                    size="lg"
                                    icon={<AiOutlineDelete />}
                                />
                                <Link href={`/category/${category.categoryId}`}>
                                    <IconButton
                                        variant="link"
                                        colorScheme="gray"
                                        aria-label="Call Sage"
                                        size="lg"
                                        icon={<AiOutlineEdit />}
                                    />
                                </Link>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
                <Tfoot>
                    <Tr>
                        <Th>Name</Th>
                        <Th>Type</Th>
                        <Th isNumeric>Action</Th>
                    </Tr>
                </Tfoot>
            </Table>
        </TableContainer>
    )
}

export default CategoryList
