import { ExpenseInput } from '@/interfaces'
import { ExpenseService } from '@/services/server-services/ExpenseService'
import { authOptions } from '@/utils/Constants'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'

const expenseService = new ExpenseService()

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    const method = _req.method
    const body = _req.body
    const id = _req.query.id
    const session = await getServerSession(_req, res, authOptions)
    try {
        switch (method) {
            case 'PATCH':
                {
                    const expense: ExpenseInput = JSON.parse(body)
                    const expenseResponse = await expenseService.updateExpense(
                        expense,
                        parseInt(id.toString()),
                        session.user
                    )
                    res.status(200).json(JSON.stringify(expenseResponse))
                }
                break

            case 'DELETE':
                {
                    const expenseResponse = await expenseService.deleteExpense(
                        parseInt(id.toString())
                    )
                    res.status(200).json(JSON.stringify(expenseResponse))
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
