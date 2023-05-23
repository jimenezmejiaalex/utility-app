import { BudgetItem } from '@/interfaces'
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

type BudgetListProps = {
    budgets: Array<BudgetItem>
    onDeleteAction: (id: number) => void
}

const BudgetList: React.FC<BudgetListProps> = ({ budgets, onDeleteAction }) => {
    const handleOnDelete = (id) => {
        onDeleteAction(id)
    }
    return (
        <TableContainer>
            <Table variant="simple">
                <TableCaption>List of Budgets</TableCaption>
                <Thead>
                    <Tr>
                        <Th>Name</Th>
                        <Th>Type</Th>
                        <Th isNumeric>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {budgets.map((budget) => (
                        <Tr key={budget.budgetId}>
                            <Td>{budget.name}</Td>
                            <Td>
                                {budget.currency} {budget.amountNumber}
                            </Td>
                            <Td isNumeric>
                                <IconButton
                                    onClick={() =>
                                        handleOnDelete(budget.budgetId)
                                    }
                                    variant="link"
                                    colorScheme="red"
                                    aria-label="Delete"
                                    size="lg"
                                    icon={<AiOutlineDelete />}
                                />
                                <Link href={`/budget/${budget.budgetId}`}>
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

export default BudgetList
