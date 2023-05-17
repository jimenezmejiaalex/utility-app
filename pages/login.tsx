import LoginForm from '@/components/LoginForm'
import withI18n from '@/components/withI18n'
import { Container, Heading } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

const login = ({}) => {
    const { t } = useTranslation()
    return (
        <Container maxW="lg" mt={8}>
            <Heading as="h1" mb={4}>
                {t('login-header')}
            </Heading>
            <LoginForm />
        </Container>
    )
}

export default withI18n(login)
