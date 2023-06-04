import Layout from '@/components/Layout'
import LoadingComponent from '@/components/Loading'
import SettingsPageComponent from '@/components/SettingsPageComponent'
import { SelectOptions, SettingsFormData, User } from '@/interfaces'
import { UserService } from '@/services/server-services/UserService'
import { redirectToLogin } from '@/utils/Constants'
import { GetServerSidePropsContext } from 'next'
import { getSession, useSession } from 'next-auth/react'
import React, { useState } from 'react'
import Login from '../login'

type SettingsPageProps = {
    users: Array<User>
    defaultData: SettingsFormData
}

const SettingsPage: React.FC<SettingsPageProps> = ({ users, defaultData }) => {
    const [isLoading, setIsLoading] = useState(false)
    const { data: session, status } = useSession()

    if (status === 'loading') {
        return <LoadingComponent />
    }

    if (!session) {
        return <Login />
    }

    const handleOnSubmit = async (settingsForm: SettingsFormData) => {
        setIsLoading(true)

        try {
            const response = await fetch('/api/users', {
                method: 'PATCH',
                body: JSON.stringify(settingsForm),
            })

            const data = await response.json()

            console.log(data)
        } catch (error) {
            console.error(error)
        }

        setIsLoading(false)
    }

    return (
        <Layout title="Settings">
            <SettingsPageComponent
                onSubmit={handleOnSubmit}
                isLoading={isLoading}
                users={users}
                defaultData={defaultData}
            />
        </Layout>
    )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getSession(ctx)
    const userService = new UserService()
    const usersDB = await userService.getAllUsers()

    let usersForAccount: Array<SelectOptions> = []

    if (!session) {
        return redirectToLogin
    }

    const usersOfAccount = await userService.getUserByEmail(session.user.email)
    usersForAccount = usersOfAccount.users.map((user) => ({
        value: user.id,
        label: user.email,
    }))

    const defaultData: SettingsFormData = {
        usersForAccount,
    }

    const usersMapped: Array<User> = usersDB.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
    }))

    const users = usersMapped.filter(
        (user) => user.email !== session.user.email
    )

    return {
        props: {
            users,
            defaultData,
        },
    }
}

export default SettingsPage
