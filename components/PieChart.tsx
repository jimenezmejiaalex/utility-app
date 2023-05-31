import { SelectedItem } from '@/interfaces'
import { Button, Flex, FormControl, FormLabel, Input } from '@chakra-ui/react'
import { Currency } from '@prisma/client'
import { ArcElement, Chart as ChartJS, Colors, Legend, Tooltip } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { useMemo, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import { getSymbol } from 'utils/CurrencyUtils'
import SelectComponent from './SelectComponent'

ChartJS.register(ArcElement, Tooltip, Legend, Colors, ChartDataLabels)

const PieCartComponent = ({ budgets, setLoading, isLoading, currencies }) => {
    const [pieData, setPieData] = useState([])

    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [budget, setBudget] = useState('')
    const [budgetName, setBudgetName] = useState('')
    const [currency, setCurrency] = useState('')

    const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setFromDate(value)
    }
    const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setToDate(value)
    }
    const handleBudgetChange = (budget: SelectedItem) => {
        setBudget(budget.toString())
    }
    const handleCurrencyChange = (currency: SelectedItem) => {
        setCurrency(currency.toString())
    }

    const getData = async () => {
        setLoading(true)
        const response = await fetch(
            `/api/expense?budgetId=${budget}&from=${fromDate}&to=${toDate}&currency=${currency}`
        )

        const data = await response.json()

        setPieData(data.categoriesByExpense)
        setBudgetName(data.budget.name)

        setLoading(false)
    }

    const generateRandomColor = () => {
        const randomColor =
            '#' + Math.floor(Math.random() * 16777215).toString(16)
        return randomColor
    }

    const backgroundColors = useMemo(() => {
        return pieData.map(() => generateRandomColor())
    }, [pieData])

    const data = {
        labels: pieData.map(
            (d) => `${d.name} (${getSymbol(Currency[currency])} ${d.value})`
        ),
        datasets: [
            {
                data: pieData.map((v) => v.value),
                backgroundColor: backgroundColors,
            },
        ],
    }

    const sum = pieData.reduce((acc, v) => acc + parseFloat(v.value), 0)

    return (
        <div>
            <FormControl mb={4}>
                <SelectComponent
                    required
                    isLoading={isLoading}
                    title="Budget"
                    placeholder="Select budget"
                    defaultValue={budget}
                    onChange={handleBudgetChange}
                    data={budgets.map((budget) => ({
                        value: budget.budgetId.toString(),
                        label: budget.name,
                    }))}
                />
            </FormControl>
            <FormControl mb={4}>
                <FormLabel>From Date</FormLabel>
                <Input
                    placeholder="Select From Date"
                    size="md"
                    type="date"
                    name="fromDate"
                    value={fromDate}
                    onChange={handleFromDateChange}
                />
            </FormControl>
            <FormControl mb={4}>
                <FormLabel>To Date</FormLabel>
                <Input
                    placeholder="Select To Date"
                    size="md"
                    type="date"
                    name="toDate"
                    value={toDate}
                    onChange={handleToDateChange}
                />
            </FormControl>
            <FormControl mb={4}>
                <SelectComponent
                    required
                    defaultValue={currency}
                    isLoading={false}
                    onChange={handleCurrencyChange}
                    data={currencies.map((currency) => ({
                        label: currency,
                        value: currency,
                    }))}
                    title="Currency"
                    placeholder="Select Currency"
                />
            </FormControl>
            <Flex justify="flex-end">
                <Button
                    onClick={getData}
                    isLoading={isLoading}
                    type="button"
                    colorScheme="gray"
                    mt={4}
                >
                    Submit
                </Button>
            </Flex>
            {true && (
                <FormControl height="500px" pb={4}>
                    <Pie
                        data={data}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                datalabels: {
                                    formatter(value) {
                                        return `${(
                                            (parseFloat(value) / sum) *
                                            100
                                        ).toFixed(2)} %`
                                    },
                                    color: 'white',
                                    labels: {
                                        title: {
                                            font: {
                                                weight: 'bold',
                                            },
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </FormControl>
            )}
        </div>
    )
}

export default PieCartComponent
