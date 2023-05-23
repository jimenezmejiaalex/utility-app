import { BankAccountItem } from '@/interfaces'
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

type AccountListProps = {
    accounts: Array<BankAccountItem>
    onDeleteAction: (id: number) => void
}

const AccountList: React.FC<AccountListProps> = ({
    accounts,
    onDeleteAction,
}) => {
    const handleOnDelete = (id) => {
        onDeleteAction(id)
    }
    return (
        <TableContainer>
            <Table variant="simple">
                <TableCaption>List of accounts</TableCaption>
                <Thead>
                    <Tr>
                        <Th>Name</Th>
                        <Th>Amount</Th>
                        <Th isNumeric>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {accounts.map((account) => (
                        <Tr key={account.accountId}>
                            <Td>{account.name}</Td>
                            <Td>{`${account.currency} ${account.amountNumber}`}</Td>
                            <Td isNumeric>
                                <IconButton
                                    onClick={() =>
                                        handleOnDelete(account.accountId)
                                    }
                                    variant="link"
                                    colorScheme="red"
                                    aria-label="Delete"
                                    size="lg"
                                    icon={<AiOutlineDelete />}
                                />
                                <Link href={`/account/${account.accountId}`}>
                                    <IconButton
                                        variant="link"
                                        colorScheme="gray"
                                        aria-label="Edit"
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
                        <Th>Amount</Th>
                        <Th isNumeric>edit</Th>
                    </Tr>
                </Tfoot>
            </Table>
        </TableContainer>
    )
}

export default AccountList
