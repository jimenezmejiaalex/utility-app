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
import { AiOutlineEdit } from 'react-icons/ai'

type AccountListProps = {
    accounts: Array<BankAccountItem>
}

const AccountList: React.FC<AccountListProps> = ({ accounts }) => {
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
                                <Link href={`/account/${account.accountId}`}>
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
                        <Th>Amount</Th>
                        <Th isNumeric>edit</Th>
                    </Tr>
                </Tfoot>
            </Table>
        </TableContainer>
    )
}

export default AccountList
