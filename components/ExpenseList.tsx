import { ExpenseItem } from '@/interfaces'
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

type ExpenseListProps = {
    expenses: Array<ExpenseItem>
    onDeleteAction: (id: number) => void
}

const ExpenseList: React.FC<ExpenseListProps> = ({
    expenses,
    onDeleteAction,
}) => {
    const handleOnDelete = (id) => {
        onDeleteAction(id)
    }
    return (
        <TableContainer>
            <Table variant="striped">
                <TableCaption>List of Expense</TableCaption>
                <Thead>
                    <Tr>
                        <Th>Name</Th>
                        <Th>Type</Th>
                        <Th isNumeric>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {expenses.map((expense) => (
                        <Tr key={expense.expenseId}>
                            <Td>{expense.name}</Td>
                            <Td>
                                {expense.currency} {expense.amountNumber}
                            </Td>
                            <Td isNumeric>
                                <IconButton
                                    onClick={() =>
                                        handleOnDelete(expense.expenseId)
                                    }
                                    variant="link"
                                    colorScheme="red"
                                    aria-label="Delete"
                                    size="lg"
                                    icon={<AiOutlineDelete />}
                                />
                                <Link href={`/expense/${expense.expenseId}`}>
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

export default ExpenseList
