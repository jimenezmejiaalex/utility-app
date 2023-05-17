import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react'
import { t } from 'i18next'
import React from 'react'

const Footer: React.FC = () => {
    const bgColor = useColorModeValue('gray.200', 'gray.700')
    const textColor = useColorModeValue('gray.600', 'gray.300')

    return (
        <Box
            bg={bgColor}
            py={4}
            position="fixed"
            bottom={0}
            left={0}
            width="100%"
            zIndex={10}
        >
            <Flex align="center" justify="center">
                <Text color={textColor}>
                    &copy; {new Date().getFullYear()} {t('footer')}
                </Text>
            </Flex>
        </Box>
    )
}

export default Footer
