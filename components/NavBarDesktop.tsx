import { Box, Flex, Link, Spacer } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import SignOutButton from './SignOutButton'

const NavBarDesktop: React.FC = () => {
    const { t } = useTranslation()

    const handleSignOut = () => {
        // Perform sign out logic here
        console.log('Signing out...')
    }

    return (
        <Box bg="primary" color="text" p={4}>
            <Flex align="center">
                <Box fontWeight="bold" fontSize="xl">
                    {t('Cool App')}
                </Box>
                <Spacer />
                <Link href="/" color="text" mx={2}>
                    {t('Home')}
                </Link>
                <Link href="/budget" color="text" mx={2}>
                    {t('Budgets')}
                </Link>
                <Link href="/account" color="text" mx={2}>
                    {t('Accounts')}
                </Link>
                <Link href="/category" color="text" mx={2}>
                    {t('Categories')}
                </Link>
                <SignOutButton />
            </Flex>
        </Box>
    )
}

export default NavBarDesktop
