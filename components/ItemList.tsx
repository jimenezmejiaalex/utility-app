import ItemComponent from '@/components/Item'
import { Box, Checkbox, Flex, Text, useTheme } from '@chakra-ui/react'
import React, { useState } from 'react'

type Item = {
    id: string
    name: string
}

type ItemListProps = {
    itemList: Item[]
}

const ItemList: React.FC<ItemListProps> = ({ itemList }) => {
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const theme = useTheme()

    const handleItemToggle = (itemId: string) => {
        setSelectedItems((prevSelectedItems) => {
            if (prevSelectedItems.includes(itemId)) {
                return prevSelectedItems.filter((id) => id !== itemId)
            } else {
                return [...prevSelectedItems, itemId]
            }
        })
    }

    const handleSelectAll = () => {
        if (selectedItems.length === itemList.length) {
            setSelectedItems([])
        } else {
            setSelectedItems(itemList.map((item) => item.id))
        }
    }

    const handleItemClick = (itemId: string) => {}

    const handleDeleteItem = (itemId: string) => {}

    return (
        <Box p={4}>
            <Flex align="center" mb={4}>
                <Checkbox
                    isChecked={selectedItems.length === itemList.length}
                    onChange={handleSelectAll}
                    mr={2}
                />
                <Text fontSize="sm">
                    {selectedItems.length} de {itemList.length} elementos
                    seleccionados
                </Text>
            </Flex>

            {itemList.map((item) => (
                <ItemComponent
                    key={item.id}
                    item={item}
                    isSelected={selectedItems.includes(item.id)}
                    onDelete={handleDeleteItem}
                    onToggle={handleItemToggle}
                    onItemClick={handleItemClick}
                />
            ))}
        </Box>
    )
}

export default ItemList
