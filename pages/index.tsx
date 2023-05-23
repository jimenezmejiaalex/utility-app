import SidebarWithHeader from '@/components/Layout'
import LoadingComponent from '@/components/Loading'
import { useSession } from 'next-auth/react'
import Login from './login'

const IndexPage = () => {
    const { data: session, status } = useSession()

    if (status === 'loading') {
        return <LoadingComponent />
    }

    if (!session) {
        return <Login />
    }

    return (
        <>
            <SidebarWithHeader title="Home Page">
                <h1>Hello</h1>
            </SidebarWithHeader>
        </>
    )
}

export default IndexPage
