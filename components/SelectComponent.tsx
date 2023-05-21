import { SelectData, SelectedItem } from '@/interfaces'
import { FormControl, FormLabel, Select } from '@chakra-ui/react'
import React from 'react'

type SelectProps = {
    title: string
    placeholder: string
    data: SelectData
    isLoading: boolean
    onChange: (selectedItem: SelectedItem) => void
    defaultValue: string | string[]
    required: boolean
    multiple?: boolean
}

const SelectComponent: React.FC<SelectProps> = ({
    data,
    onChange,
    isLoading,
    defaultValue,
    placeholder,
    title,
    required,
    multiple,
}) => {
    const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(event.target.value)
        onChange(event.target.value)
    }

    return (
        <FormControl>
            <FormLabel>{title}</FormLabel>
            <Select
                multiple={multiple}
                required={required}
                disabled={isLoading}
                placeholder={placeholder}
                onChange={handleUserChange}
                defaultValue={defaultValue}
            >
                {data.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </Select>
        </FormControl>
    )
}

export default SelectComponent
