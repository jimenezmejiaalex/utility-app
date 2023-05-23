import {
    Checkbox,
    Flex,
    IconButton,
    Text,
    useColorModeValue,
    useTheme,
} from '@chakra-ui/react'
import { t } from 'i18next'
import { Item } from 'interfaces'
import React from 'react'
import { FiShoppingCart, FiTrash } from 'react-icons/fi'

type ItemProps = {
    item: Item
    isSelected: boolean
    onDelete: (itemId: string) => void
    onToggle: (itemId: string) => void
    onItemClick: (itemId: string) => void
}

const Item: React.FC<ItemProps> = ({
    item,
    isSelected,
    onDelete,
    onToggle,
    onItemClick,
}) => {
    const theme = useTheme()
    const deleteIconColor = useColorModeValue(
        theme.colors.red[500],
        theme.colors.red[300]
    )
    const cartIconColor = useColorModeValue(
        theme.colors.green[500],
        theme.colors.green[300]
    )

    return (
        <Flex
            key={item.id}
            align="center"
            py={2}
            px={4}
            bg={isSelected ? 'primary' : undefined}
            borderRadius="md"
            mb={2}
        >
            <Checkbox
                isChecked={isSelected}
                onChange={() => onToggle(item.id)}
                mr={2}
            />

            <FiShoppingCart
                color={cartIconColor}
                style={{ marginRight: '0.5rem' }}
            />

            <Text
                flex="1"
                fontSize="md"
                fontWeight={isSelected ? 'bold' : undefined}
                color={isSelected ? 'white' : undefined}
                onClick={() => onItemClick(item.id)}
                cursor="pointer"
            >
                {item.name}
            </Text>

            <IconButton
                icon={<FiTrash />}
                aria-label={t('Delete item')}
                variant="ghost"
                color={deleteIconColor}
                onClick={() => onDelete(item.id)}
            />
        </Flex>
    )
}

export default Item
