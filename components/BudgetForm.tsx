import {
    BankAccountType,
    BudgetFormData,
    CategoryType,
    SelectOptions,
} from '@/interfaces'
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
import { Select } from 'chakra-react-select'
import React, { useState } from 'react'
import SelectComponent from './SelectComponent'

type BudgetFormProps = {
    onSubmit: (budget: BudgetFormData) => void
    isLoading: boolean
    defaultData?: BudgetFormData
    categories: Array<CategoryType>
    accounts: Array<BankAccountType>
    currencies: Array<Currency>
}

const BudgetForm: React.FC<BudgetFormProps> = ({
    onSubmit,
    isLoading,
    defaultData,
    categories,
    accounts,
    currencies,
}) => {
    const [formData, setFormData] = useState<BudgetFormData>(
        defaultData || {
            name: '',
            amount: 0,
            startDate: '',
            endDate: '',
            accounts: [],
            categories: [],
            currency: null,
        }
    )

    const categoriesOptions: Array<SelectOptions> = categories.map(
        (category) => ({
            value: category.categoryId.toString(),
            label: category.name,
        })
    )

    const accountsOptions: Array<SelectOptions> = accounts.map((account) => ({
        value: account.accountId.toString(),
        label: account.name,
    }))

    const categoriesSelected: Array<SelectOptions> = []

    const accountsSelected: Array<SelectOptions> = []

    if (formData?.categories && formData.categories.length > 0) {
        formData.categories.forEach((category) =>
            categoriesSelected.push(
                categoriesOptions.find((c) => c.value === category.value)
            )
        )
    }

    if (formData?.accounts && formData.categories.length > 0) {
        formData.accounts.forEach((account) =>
            accountsSelected.push(
                accountsOptions.find((a) => a.value === account.value)
            )
        )
    }

    const handleCategoryChange = (selectedCategories: Array<SelectOptions>) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            categories: selectedCategories,
        }))
    }

    const handleAccountChange = (selectedAccounts: Array<SelectOptions>) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            accounts: selectedAccounts,
        }))
    }

    const handleAmountChange = (_, amountNumber: number) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            amount: amountNumber,
        }))
    }

    const handleCurrenciesChange = (selectedCurrency: Currency) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            currency: selectedCurrency,
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
                    <FormLabel>Start Date</FormLabel>
                    <Input
                        placeholder="Select Start Date"
                        size="md"
                        type="datetime-local"
                        name="startDate"
                        value={formData.startDate || ''}
                        onChange={handleChange}
                    />
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel>End Date</FormLabel>
                    <Input
                        placeholder="Select End Date"
                        size="md"
                        type="datetime-local"
                        name="endDate"
                        value={formData.endDate || ''}
                        onChange={handleChange}
                    />
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel>Categories</FormLabel>
                    <Select
                        name="categories"
                        isMulti
                        options={categoriesOptions}
                        placeholder="Select Categories"
                        closeMenuOnSelect={false}
                        onChange={handleCategoryChange}
                        defaultValue={categoriesSelected}
                    />
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel>Accounts</FormLabel>
                    <Select
                        name="accounts"
                        isMulti
                        options={accountsOptions}
                        placeholder="Select Accounts"
                        closeMenuOnSelect={false}
                        onChange={handleAccountChange}
                        defaultValue={accountsSelected}
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

export default BudgetForm
