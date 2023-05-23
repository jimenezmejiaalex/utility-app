import { CategoryFormData } from '@/interfaces'
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
} from '@chakra-ui/react'
import { Type } from '@prisma/client'
import React, { useState } from 'react'
import SelectComponent from './SelectComponent'

type CategoryFormProps = {
    onSubmit: (category: CategoryFormData) => void
    isLoading: boolean
    defaultData?: CategoryFormData
    types: Array<Type>
}

const CategoryForm: React.FC<CategoryFormProps> = ({
    onSubmit,
    isLoading,
    defaultData,
    types,
}) => {
    const [formData, setFormData] = useState<CategoryFormData>(
        defaultData || {
            name: '',
            type: null,
        }
    )

    const handleTypeChange = (selectedType: Type) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            type: selectedType,
        }))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name.length !== 0) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <Box p={4}>
            <form onSubmit={handleSubmit}>
                <FormControl mb={4}>
                    <FormLabel>Name</FormLabel>
                    <Input
                        required
                        disabled={isLoading}
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                    />
                </FormControl>

                <FormControl mb={4}>
                    <SelectComponent
                        required
                        defaultValue={formData.type}
                        isLoading={isLoading}
                        onChange={handleTypeChange}
                        data={types.map((type) => ({
                            label: type,
                            value: type,
                        }))}
                        title="Type"
                        placeholder="Select Type"
                    />
                </FormControl>

                <Flex justify="flex-end">
                    <Button
                        isLoading={isLoading}
                        type="submit"
                        colorScheme="gray"
                        mt={4}
                    >
                        Submit
                    </Button>
                </Flex>
            </form>
        </Box>
    )
}

export default CategoryForm
