import { SelectOptions, SettingsFormData, User } from '@/interfaces'
import { Box, Button, Flex, FormControl, FormLabel } from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import { useState } from 'react'

type SettingsPageComponentProps = {
    onSubmit: (settingsFormData: SettingsFormData) => void
    isLoading: boolean
    defaultData?: SettingsFormData
    users: Array<User>
}

const SettingsPageComponent: React.FC<SettingsPageComponentProps> = ({
    onSubmit,
    isLoading,
    defaultData,
    users,
}) => {
    const [formData, setFormData] = useState<SettingsFormData>(
        defaultData || {
            usersForAccount: [],
        }
    )
    console.log(formData)
    const handleOnSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }
    const handleUsersChange = (selectedUsers: Array<SelectOptions>) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            usersForAccount: selectedUsers,
        }))
    }

    const userOptions: Array<SelectOptions> = users.map((user) => ({
        value: user.id,
        label: user.email,
    }))

    const usersSelected: Array<SelectOptions> = []

    if (formData?.usersForAccount && formData.usersForAccount.length > 0) {
        formData.usersForAccount.forEach((user) =>
            usersSelected.push(userOptions.find((c) => c.value === user.value))
        )
    }

    return (
        <Box p={4}>
            <form onSubmit={handleOnSubmit}>
                <FormControl mb={4}>
                    <FormLabel>Users in your account</FormLabel>
                    <Select
                        name="users"
                        isMulti
                        options={userOptions}
                        placeholder="Select Users to Add"
                        closeMenuOnSelect={false}
                        onChange={handleUsersChange}
                        defaultValue={usersSelected}
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

export default SettingsPageComponent
