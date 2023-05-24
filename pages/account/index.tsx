import AccountList from '@/components/AccountList'
import Layout from '@/components/Layout'
import LoadingComponent from '@/components/Loading'
import { BankAccountItem } from '@/interfaces'
import { AccountService } from '@/services/AccountService'
import { Box, IconButton } from '@chakra-ui/react'
import Link from 'next/link'
import { GetStaticProps } from 'next/types'
import React, { useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'

type AccountProps = {
    accounts: Array<BankAccountItem>
}

const Account: React.FC<AccountProps> = ({ accounts }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [accountsState, setAccountsState] = useState(accounts)
    const onDeleteAction = async (id: number) => {
        setIsLoading(true)
        const response = await fetch(`/api/account/${id}`, {
            method: 'DELETE',
        })
        const data = await response.json()
        console.log(data)
        setAccountsState([
            ...accountsState.filter((account) => account.accountId !== id),
        ])
        setIsLoading(false)
    }
    if (isLoading) {
        return <LoadingComponent />
    }
    return (
        <Layout title="Accounts">
            <AccountList
                onDeleteAction={onDeleteAction}
                accounts={accountsState}
            />
            <Box
                position="fixed"
                bottom="80px"
                right={['16px', '14px']}
                zIndex={1}
            >
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
}

export const getStaticProps: GetStaticProps = async (ctx) => {
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
        revalidate: 10,
    }
}

export default Account
