import {
    Box,
    Drawer,
    DrawerContent,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react'
import Head from 'next/head'
import { ReactNode } from 'react'
import Footer from './Footer'
import { MobileNav } from './MobileNav'
import { SidebarContent } from './SideBarContent'

type Props = {
    children: ReactNode
    title: string
}

export default function Layout({ children, title }: Props) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <Box minH="100vh" bg={useColorModeValue('white', 'gray.900')}>
            <Head>
                <title>{title}</title>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            <Box position="fixed" width="100%" zIndex={50}>
                <header>
                    <SidebarContent
                        onClose={() => onClose}
                        display={{ base: 'none', md: 'block' }}
                    />
                    <Drawer
                        autoFocus={false}
                        isOpen={isOpen}
                        placement="left"
                        onClose={onClose}
                        returnFocusOnClose={false}
                        onOverlayClick={onClose}
                        size="full"
                    >
                        <DrawerContent>
                            <SidebarContent onClose={onClose} />
                        </DrawerContent>
                    </Drawer>

                    <MobileNav onOpen={onOpen} />
                </header>
            </Box>
            <Box minH="100vh" ml={{ base: 0, md: 60 }} p="4">
                <Box mt="80px" mb="80px">
                    {children}
                </Box>
            </Box>
            <Box position="fixed" width="100%" bottom="0" right="0">
                <footer>
                    <Footer />
                </footer>
            </Box>
        </Box>
    )
}
