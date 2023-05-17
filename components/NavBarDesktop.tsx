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
                <Link href="/about" color="text" mx={2}>
                    {t('About')}
                </Link>
                <Link href="/users" color="text" mx={2}>
                    {t('Users List')}
                </Link>
                <SignOutButton />
            </Flex>
        </Box>
    )
}

export default NavBarDesktop
