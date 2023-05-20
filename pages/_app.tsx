import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'
import NextNProgress from 'nextjs-progressbar'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import theme from '../theme'

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}) {
    return (
        <>
            <SessionProvider session={session}>
                <I18nextProvider i18n={i18n}>
                    <ChakraProvider theme={theme}>
                        <Component {...pageProps} />
                        <NextNProgress
                            color="#29D"
                            startPosition={0.3}
                            stopDelayMs={200}
                            height={3}
                        />
                    </ChakraProvider>
                </I18nextProvider>
            </SessionProvider>
        </>
    )
}
