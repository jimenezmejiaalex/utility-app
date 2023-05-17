import { Button } from '@chakra-ui/react'
import { signOut, useSession } from 'next-auth/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiLogOut } from 'react-icons/fi'

const SignOutButton: React.FC = () => {
    const { t } = useTranslation()
    const { data: session } = useSession()

    const handleSignOut = async () => {
        await signOut({ redirect: false })
    }

    return (
        <Button
            leftIcon={<FiLogOut />}
            colorScheme="primary"
            onClick={handleSignOut}
        >
            {t('Sign Out')}
        </Button>
    )
}

export default SignOutButton
