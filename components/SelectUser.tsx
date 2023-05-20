import { User } from '@/interfaces'
import { FormControl, FormLabel, Select } from '@chakra-ui/react'
import React from 'react'

type SelectUserProps = {
    users: User[]
    isLoading: boolean
    onChange: (selectedUser: string) => void
    defaultValue: string
}

const SelectUser: React.FC<SelectUserProps> = ({
    users,
    onChange,
    isLoading,
    defaultValue,
}) => {
    const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(event.target.value)
        onChange(event.target.value)
    }

    const userOptions = users.map((user) => ({
        value: user.email,
        label: user.name,
    }))

    return (
        <FormControl>
            <FormLabel>User</FormLabel>
            <Select
                disabled={isLoading}
                placeholder="Select option"
                onChange={handleUserChange}
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

export default SelectUser
