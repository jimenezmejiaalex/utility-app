import { AccountFormData, User } from '@/interfaces'
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
} from '@chakra-ui/react'
import { Currency } from '@prisma/client'
import React, { useState } from 'react'
import SelectUser from './SelectUser'

type BankAccountFormProps = {
    users: User[]
    currencies: Currency[]
    onSubmit: (bankAccount: AccountFormData) => void
    isLoading: boolean
    defaultData?: AccountFormData
}

const CategoryForm: React.FC<BankAccountFormProps> = ({
    users,
    currencies,
    onSubmit,
    isLoading,
    defaultData,
}) => {
    const [formData, setFormData] = useState<AccountFormData>(
        defaultData || {
            name: '',
            currency: '',
            amount: 0,
            email: '',
        }
    )

    console.log(formData)

    const handleUserChange = (selectedUser: string) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            email: selectedUser,
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
                        disabled={isLoading}
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                    />
                </FormControl>

                <FormControl mb={4}>
                    <SelectUser
                        defaultValue={formData.email}
                        isLoading={isLoading}
                        onChange={handleUserChange}
                        users={users}
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
