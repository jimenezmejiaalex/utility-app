import RemindersList from '@/components/ItemList'
import LoadingComponent from '@/components/Loading'
import { Item } from 'interfaces'
import { useSession } from 'next-auth/react'
import Layout from '../components/Layout'
import Login from './login'

const IndexPage = () => {
    const { data: session, status } = useSession()

    const itemList: Item[] = [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
        { id: '3', name: 'Item 3' },
        // Agrega más elementos según sea necesario
    ]

    if (status === 'loading') {
        return <LoadingComponent />
    }

    if (!session) {
        return <Login />
    }

    return (
        <>
            <Layout title="Home | Next.js + TypeScript Example">
                <RemindersList itemList={itemList} />
            </Layout>
        </>
    )
}

export default IndexPage
