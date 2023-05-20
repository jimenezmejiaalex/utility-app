import { FormControl, FormLabel, Select } from '@chakra-ui/react'
import { Currency } from '@prisma/client'
import React from 'react'

type SelectCurrencyProps = {
    currencies: Currency[]
    isLoading: boolean
    onChange: (selectedCurrency: string) => void
    defaultValue: string
}

const SelectCurrency: React.FC<SelectCurrencyProps> = ({
    currencies,
    onChange,
    isLoading,
    defaultValue,
}) => {
    const handleCurrencyChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        onChange(event.target.value)
    }

    const userOptions = currencies.map((currency) => ({
        value: currency,
        label: currency,
    }))

    return (
        <FormControl>
            <FormLabel>Currency</FormLabel>
            <Select
                placeholder="Select option"
                disabled={isLoading}
                onChange={handleCurrencyChange}
                defaultValue={defaultValue}
            >
                {userOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </Select>
        </FormControl>
    )
}

export default SelectCurrency
