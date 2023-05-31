import {
    BudgetType,
    CategoryType,
    ExpenseFormData,
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

type ExpenseFormProps = {
    onSubmit: (expense: ExpenseFormData) => void
    isLoading: boolean
    defaultData?: ExpenseFormData
    budgets: Array<BudgetType>
    currencies: Array<Currency>
    categories: Array<CategoryType>
}

const BudgetForm: React.FC<ExpenseFormProps> = ({
    onSubmit,
    isLoading,
    defaultData,
    budgets,
    currencies,
    categories,
}) => {
    console.log(budgets)
    const [formData, setFormData] = useState<ExpenseFormData>(
        defaultData || {
            name: '',
            currency: null,
            amount: 0,
            createdAt: '',
            budgetId: '',
            categories: [],
        }
    )

    const categoriesOptions: Array<SelectOptions> = categories.map(
        (category) => ({
            value: category.categoryId.toString(),
            label: category.name,
        })
    )

    const categoriesSelected: Array<SelectOptions> = []

    if (formData?.categories && formData.categories.length > 0) {
        formData.categories.forEach((category) =>
            categoriesSelected.push(
                categoriesOptions.find((c) => c.value === category.value)
            )
        )
    }

    const handleCategoryChange = (selectedCategories: Array<SelectOptions>) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            categories: selectedCategories,
        }))
    }

    const handleBudgetChange = (budgetId: string) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            budgetId: budgetId,
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
        console.log(name, value)
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
                    <FormLabel>Date</FormLabel>
                    <Input
                        placeholder="Select Date"
                        size="md"
                        type="datetime-local"
                        name="createdAt"
                        value={formData.createdAt || ''}
                        onChange={handleChange}
                    />
                </FormControl>

                <FormControl mb={4}>
                    <SelectComponent
                        required
                        title="Budget"
                        placeholder="Select budget"
                        isLoading={isLoading}
                        defaultValue={formData.budgetId}
                        onChange={handleBudgetChange}
                        data={budgets.map((budget) => ({
                            value: budget.budgetId.toString(),
                            label: budget.name,
                        }))}
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
