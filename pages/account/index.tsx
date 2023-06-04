import AccountList from '@/components/AccountList'
import Layout from '@/components/Layout'
import LoadingComponent from '@/components/Loading'
import { BankAccountItem } from '@/interfaces'
import Login from '@/pages/login'
import { AccountService } from '@/services/server-services/AccountService'
import { redirectToLogin } from '@/utils/Constants'
import { Stack } from '@chakra-ui/layout'
import { Box, IconButton, Text } from '@chakra-ui/react'
import { getSession, useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'

type AccountProps = {
    accounts: Array<BankAccountItem>
}

const Account: React.FC<AccountProps> = ({ accounts }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [accountsState, setAccountsState] = useState(accounts)
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
        const response = await fetch(`/api/account/${id}`, {
            method: 'DELETE',
        })
        const data = await response.json()

        setAccountsState([
            ...accountsState.filter((account) => account.accountId !== id),
        ])
        setIsLoading(false)
    }

    return (
        <Layout title="Accounts">
            {accounts.length > 0 ? (
                <AccountList
                    onDeleteAction={onDeleteAction}
                    accounts={accountsState}
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

export const getServerSideProps = async (ctx) => {
    const session = await getSession(ctx)
    if (!session) {
        return redirectToLogin
    }
    const accountService = new AccountService()
    const bankAccounts = await accountService.getBankAccounts(session.user)
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
