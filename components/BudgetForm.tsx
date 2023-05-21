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
import { MultiValue, Select, useChakraSelectProps } from 'chakra-react-select'
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

    console.log(formData)

    const selectCategoriesProps = useChakraSelectProps({
        name: 'categories',
        instanceId: 'chakra-react-select-1',
        isMulti: true,
        options: categories.map((category) => ({
            value: category.categoryId.toString(),
            label: category.name,
        })),
        placeholder: 'Select Categories',
        closeMenuOnSelect: false,
        onChange(newValue: MultiValue<SelectOptions>) {
            handleCategoryChange([...newValue.map((option) => option.value)])
        },
    })

    const selectAccountsProps = useChakraSelectProps({
        name: 'accounts',
        instanceId: 'chakra-react-select-2',
        isMulti: true,
        options: accounts.map((account) => ({
            value: account.accountId.toString(),
            label: account.name,
        })),
        placeholder: 'Select Accounts',
        closeMenuOnSelect: false,
        onChange(newValue: MultiValue<SelectOptions>) {
            handleAccountChange([...newValue.map((option) => option.value)])
        },
    })

    const handleCategoryChange = (selectedCategories: Array<string>) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            categories: selectedCategories,
        }))
    }

    const handleAccountChange = (selectedAccounts: Array<string>) => {
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
                        onChange={handleChange}
                    />
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel>Categories</FormLabel>
                    <Select
                        name={selectCategoriesProps.name}
                        instanceId={selectCategoriesProps.instanceId}
                        isMulti={selectCategoriesProps.isMulti}
                        options={selectCategoriesProps.options}
                        placeholder={selectCategoriesProps.placeholder}
                        closeMenuOnSelect={
                            selectCategoriesProps.closeMenuOnSelect
                        }
                        onChange={selectCategoriesProps.onChange}
                    />
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel>Accounts</FormLabel>
                    <Select
                        name={selectAccountsProps.name}
                        instanceId={selectAccountsProps.instanceId}
                        isMulti={selectAccountsProps.isMulti}
                        options={selectAccountsProps.options}
                        placeholder={selectAccountsProps.placeholder}
                        closeMenuOnSelect={
                            selectAccountsProps.closeMenuOnSelect
                        }
                        onChange={selectAccountsProps.onChange}
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
