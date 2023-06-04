import { AccountFormData, User } from '@/interfaces'
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
} from '@chakra-ui/react'
import { Currency } from '@prisma/client'
import React, { useState } from 'react'
import SelectComponent from './SelectComponent'

type BankAccountFormProps = {
    users: User[]
    currencies: Currency[]
    onSubmit: (bankAccount: AccountFormData) => void
    isLoading: boolean
    defaultData?: AccountFormData
}

const BankAccountForm: React.FC<BankAccountFormProps> = ({
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

    const handleUserChange = (selectedUser: string) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            email: selectedUser,
        }))
    }

    const handleCurrenciesChange = (selectedCurrency: Currency) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            currency: selectedCurrency,
        }))
    }

    const handleAmountChange = (_, amountNumber: number) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            amount: amountNumber,
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
                    <SelectComponent
                        required
                        defaultValue={formData.email}
                        isLoading={isLoading}
                        onChange={handleUserChange}
                        data={users.map((user) => ({
                            label: `${user.name} - (${user.email})`,
                            value: user.email,
                        }))}
                        title="User"
                        placeholder="Select User"
                    />
                </FormControl>

                <FormControl mb={4}>
                    <SelectComponent
                        required
                        defaultValue={formData.currency}
                        isLoading={isLoading}
                        onChange={handleCurrenciesChange}
                        data={currencies.map((currency) => ({
                            label: currency,
                            value: currency,
                        }))}
                        title="Currency"
                        placeholder="Select Currency"
                    />
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel>Amount</FormLabel>
                    <NumberInput
                        defaultValue={formData.amount}
                        isDisabled={isLoading}
                        onChange={handleAmountChange}
                        step={1}
                        min={0}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
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

export default BankAccountForm
