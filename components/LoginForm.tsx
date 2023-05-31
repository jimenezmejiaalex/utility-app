import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Stack,
    useBreakpointValue,
} from '@chakra-ui/react'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaGoogle } from 'react-icons/fa'

const LoginForm: React.FC = () => {
    const { t } = useTranslation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const googleProvider = true

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Perform login logic here
        setLoading(true)
        setError('')

        try {
            // Simulating an asynchronous login request
            await new Promise<void>((resolve, reject) => {
                setTimeout(() => {
                    if (
                        email === 'example@example.com' &&
                        password === 'password'
                    ) {
                        resolve()
                    } else {
                        reject(new Error('Invalid email or password'))
                    }
                }, 2000)
            })

            // Login successful
            setLoading(false)
        } catch (error) {
            setLoading(false)
            setError(error.message)
        }
    }

    const handleGoogleSignIn = () => {
        // Handle Google sign in logic
        signIn()
    }

    const formWidth = useBreakpointValue({
        base: '100%',
        md: '400px',
        lg: '500px',
    })

    return (
        <Box>
            <form onSubmit={handleSubmit}>
                <Stack spacing={4} align="center" width={formWidth} mx="auto">
                    {!googleProvider ? (
                        <FormControl isInvalid={!!error}>
                            <FormLabel>{t('email')}</FormLabel>
                            <Input
                                type="email"
                                placeholder={t('enter-email')}
                                value={email}
                                onChange={handleEmailChange}
                            />
                            <FormLabel>{t('password')}</FormLabel>
                            <Input
                                type="password"
                                placeholder={t('enter-password')}
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            <FormErrorMessage>{error}</FormErrorMessage>
                            <Button
                                colorScheme="teal"
                                isLoading={loading}
                                type="submit"
                            >
                                {t('sign-in')}
                            </Button>
                        </FormControl>
                    ) : (
                        <Button
                            variant="outline"
                            colorScheme="teal"
                            leftIcon={<FaGoogle />}
                            onClick={handleGoogleSignIn}
                        >
                            {t('sign-in-with-google')}
                        </Button>
                    )}
                </Stack>
            </form>
        </Box>
    )
}

export default LoginForm
