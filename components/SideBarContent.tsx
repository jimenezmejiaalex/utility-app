import {
    Box,
    BoxProps,
    CloseButton,
    Flex,
    Text,
    useColorModeValue,
} from '@chakra-ui/react'
import { IconType } from 'react-icons'
import {
    FiBriefcase,
    FiDollarSign,
    FiHome,
    FiList,
    FiSettings,
    FiTrendingDown,
} from 'react-icons/fi'
import { NavItem } from './NavItem'

interface SidebarProps extends BoxProps {
    onClose: () => void
}

interface LinkItemProps {
    name: string
    icon: IconType
    href: string
}

const LinkItems: Array<LinkItemProps> = [
    { name: 'Home', icon: FiHome, href: '/' },
    { name: 'Expenses', icon: FiTrendingDown, href: '/expense' },
    { name: 'Budgets', icon: FiDollarSign, href: '/budget' },
    { name: 'Accounts', icon: FiBriefcase, href: '/account' },
    { name: 'Categories', icon: FiList, href: '/category' },
    { name: 'Settings', icon: FiSettings, href: '$' },
]

export const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}
        >
            <Flex
                h="20"
                alignItems="center"
                mx="8"
                justifyContent="space-between"
            >
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                    Logo
                </Text>
                <CloseButton
                    display={{ base: 'flex', md: 'none' }}
                    onClick={onClose}
                />
            </Flex>
            {LinkItems.map((link) => (
                <NavItem key={link.name} icon={link.icon} href={link.href}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    )
}
