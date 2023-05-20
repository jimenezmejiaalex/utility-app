import AccountList from '@/components/AccountList'
import Layout from '@/components/Layout'
import { BankAccountItem } from '@/interfaces'
import { AccountService } from '@/services/AccountService'
import { Box, IconButton } from '@chakra-ui/react'
import Link from 'next/link'
import { GetServerSideProps } from 'next/types'
import React from 'react'
import { AiOutlinePlus } from 'react-icons/ai'

type AccountProps = {
    accounts: Array<BankAccountItem>
}

const Account: React.FC<AccountProps> = ({ accounts }) => (
    <Layout title="Accounts">
        <AccountList accounts={accounts} />
        <Box position="fixed" bottom="80px" right={['16px', '14px']} zIndex={1}>
            <Link href="/account/add">
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

export const getServerSideProps: GetServerSideProps<AccountProps> = async (
    ctx
) => {
    const accountService = new AccountService()
    const bankAccounts = await accountService.getBankAccounts()
    const accounts: Array<BankAccountItem> = bankAccounts.map((account) => ({
        name: account.name,
        accountId: account.accountId,
        currency: account.currency,
        amountNumber: account.amount.toNumber(),
    }))
    return {
        props: {
            accounts,
        },
    }
}

export default Account
