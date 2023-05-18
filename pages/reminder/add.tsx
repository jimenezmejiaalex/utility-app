import Layout from '@/components/Layout'
import LoadingComponent from '@/components/Loading'
import ReminderForm from '@/components/ReminderForm'
import Login from '@/pages/login'
import { Reminder } from '@prisma/client'
import { useSession } from 'next-auth/react'

const AddReminderPage = () => {
    const { data: session, status } = useSession()

    if (status === 'loading') {
        return <LoadingComponent />
    }

    if (!session) {
        return <Login />
    }

    const handleOnSubmit = async (reminder: Reminder) => {
        const response = await fetch('/api/reminders', {
            method: 'POST',
            body: JSON.stringify(reminder),
        })

        const data = await response.json()
        console.log(data)
    }

    return (
        <>
            <Layout title="Home | Next.js + TypeScript Example">
                <ReminderForm onSubmit={handleOnSubmit} />
            </Layout>
        </>
    )
}

export default AddReminderPage
