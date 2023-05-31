import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    useTheme,
} from '@chakra-ui/react'
import React, { useState } from 'react'

type ReminderFormProps = {
    onSubmit: (formData: FormData) => void
}

type FormData = {
    name: string | null
    assignedAt: Date
    assignedBy: string
}

const ReminderForm: React.FC<ReminderFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<FormData>({
        name: null,
        assignedAt: new Date(),
        assignedBy: '',
    })
    const theme = useTheme()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name.length !== 0) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }))
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <Box p={4}>
            <form onSubmit={handleSubmit}>
                <FormControl mb={4}>
                    <FormLabel>Name</FormLabel>
                    <Input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                    />
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel>Assigned At</FormLabel>
                    <Input
                        placeholder="Select Date and Time"
                        size="md"
                        type="datetime-local"
                        name="assignedAt"
                        onChange={handleChange}
                    />
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel>Assigned By</FormLabel>
                    <Input
                        type="text"
                        name="assignedBy"
                        value={formData.assignedBy}
                        onChange={handleChange}
                    />
                </FormControl>

                <Flex justify="flex-end">
                    <Button
                        type="submit"
                        colorScheme="gray"
                        mt={4}
                        disabled={!formData.name || !formData.assignedBy}
                    >
                        Submit
                    </Button>
                </Flex>
            </form>
        </Box>
    )
}

export default ReminderForm
