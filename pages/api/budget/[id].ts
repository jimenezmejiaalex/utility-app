import { BudgetInput } from '@/interfaces'
import { BudgetService } from '@/services/server-services/BudgetService'
import { authOptions } from '@/utils/Constants'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'

const budgetService = new BudgetService()

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    const method = _req.method
    const body = _req.body
    const id = _req.query.id
    const session = await getServerSession(_req, res, authOptions)
    try {
        switch (method) {
            case 'PATCH':
                {
                    const newBudget: BudgetInput = JSON.parse(body)
                    const accountResponse = await budgetService.updateBudget(
                        newBudget,
                        parseInt(id.toString())
                    )
                    res.status(200).json(JSON.stringify(accountResponse))
                }
                break

            case 'DELETE':
                {
                    const budgetResponse = await budgetService.deleteBudget(
                        parseInt(id.toString())
                    )
                    res.status(200).json(JSON.stringify(budgetResponse))
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
