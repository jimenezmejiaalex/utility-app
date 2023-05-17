import { Center, Spinner } from '@chakra-ui/react'

const LoadingComponent: React.FC = () => {
    return (
        <Center height="100vh">
            <Spinner size="xl" color="blue.500" />
        </Center>
    )
}

export default LoadingComponent
