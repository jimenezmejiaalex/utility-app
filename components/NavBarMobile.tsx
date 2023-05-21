import {
    Box,
    Collapse,
    Flex,
    IconButton,
    Link,
    useDisclosure,
} from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiMenu, FiX } from 'react-icons/fi'
import SignOutButton from './SignOutButton'

const NavBarMobile: React.FC = () => {
    const { t } = useTranslation()
    const { isOpen, onToggle } = useDisclosure()

    const handleSignOut = () => {
        // Perform sign out logic here
        console.log('Signing out...')
    }

    return (
        <Box bg="primary" color="text" p={4}>
            <Flex align="center" justify="space-between">
                <IconButton
                    icon={isOpen ? <FiX /> : <FiMenu />}
                    aria-label={isOpen ? 'Close menu' : 'Open menu'}
                    variant="ghost"
                    onClick={onToggle}
                    mr={2}
                />
                <Box fontWeight="bold" fontSize="xl">
                    {t('Cool App')}
                </Box>
            </Flex>
            <Collapse in={isOpen} animateOpacity>
                <Box
                    bg="primary"
                    color="text"
                    p={4}
                    transformOrigin="left"
                    transform={isOpen ? 'translateX(0)' : 'translateX(-100%)'}
                    transition="transform 0.3s ease-in-out"
                    position="fixed"
                    top={0}
                    left={0}
                    bottom={0}
                    zIndex={999}
                    width="240px"
                >
                    <Flex direction="column" height="100%">
                        <Link
                            href="/"
                            color="text"
                            py={2}
                            px={4}
                            _hover={{ bg: 'secondary', color: 'white' }}
                        >
                            {t('Home')}
                        </Link>
                        <Link
                            href="/account"
                            color="text"
                            py={2}
                            px={4}
                            _hover={{ bg: 'secondary', color: 'white' }}
                        >
                            {t('Accounts')}
                        </Link>
                        <Link
                            href="/category"
                            color="text"
                            py={2}
                            px={4}
                            _hover={{ bg: 'secondary', color: 'white' }}
                        >
                            {t('Categories')}
                        </Link>
                        <Box flex={1} />
                        <SignOutButton />
                    </Flex>
                    {isOpen && (
                        <IconButton
                            icon={<FiX />}
                            aria-label="Close menu"
                            variant="ghost"
                            onClick={onToggle}
                            position="absolute"
                            top={2}
                            right={2}
                        />
                    )}
                </Box>
            </Collapse>
        </Box>
    )
}

export default NavBarMobile
