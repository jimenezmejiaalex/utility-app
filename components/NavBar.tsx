import { useBreakpointValue } from '@chakra-ui/react'
import NavBarDesktop from './NavBarDesktop'
import NavBarMobile from './NavBarMobile'
export const NavBar = () => {
    const isMobile = useBreakpointValue({ base: true, md: false })
    return isMobile ? <NavBarMobile /> : <NavBarDesktop />
}
