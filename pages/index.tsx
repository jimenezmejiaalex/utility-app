import LoadingComponent from '@/components/Loading'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Layout from '../components/Layout'
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
            <Layout title="Home | Next.js + TypeScript Example">
                <h1>Hello Next.js 👋</h1>
                <p>
                    <Link href="/about">About</Link>
                </p>
            </Layout>
        </>
    )
}

export default IndexPage
