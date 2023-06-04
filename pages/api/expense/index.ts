import { ExpenseInput } from '@/interfaces'
import { BudgetService } from '@/services/server-services/BudgetService'
import { CurrencyService } from '@/services/server-services/CurrencyService'
import { ExpenseService } from '@/services/server-services/ExpenseService'
import { authOptions } from '@/utils/Constants'
import { Currency } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'

const expenseService = new ExpenseService()
const budgetService = new BudgetService()
const currencyService = new CurrencyService()

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    const method = _req.method
    const body = _req.body
    const params = _req.query
    const session = await getServerSession(_req, res, authOptions)
    try {
        switch (method) {
            case 'POST':
                {
                    const newExpense: ExpenseInput = JSON.parse(body)
                    const expenseResponse = await expenseService.addExpense(
                        newExpense,
                        session.user
                    )
                    res.status(200).json(JSON.stringify(expenseResponse))
                }
                break
            case 'GET':
                {
                    const { budgetId, from, to } = params
                    const currency: Currency =
                        Currency[params.currency.toString()]
                    const { expenses, budget, categoriesByExpense } =
                        await expenseService.getExpensesByCategory(
                            parseInt(budgetId.toString()),
                            from.toString(),
                            to.toString(),
                            currency,
                            session.user
                        )
                    res.status(200).json({
                        expenses,
                        budget,
                        categoriesByExpense,
                    })
                }
                break

            default:
                break
        }
    } catch (err) {
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}

export default handler
