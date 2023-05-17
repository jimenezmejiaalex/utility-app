import Head from 'next/head'
import { ReactNode } from 'react'
import Footer from './Footer'
import { NavBar } from './NavBar'

type Props = {
    children?: ReactNode
    title?: string
}

const Layout = ({ children, title = 'This is the default title' }: Props) => (
    <div>
        <Head>
            <title>{title}</title>
            <meta charSet="utf-8" />
            <meta
                name="viewport"
                content="initial-scale=1.0, width=device-width"
            />
        </Head>
        <header>
            <NavBar />
        </header>
        {children}
        <footer>
            <Footer />
        </footer>
    </div>
)

export default Layout
