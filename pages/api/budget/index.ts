import { BudgetInput } from '@/interfaces';
import { BudgetService } from '@/services/BudgetService';
import { NextApiRequest, NextApiResponse } from 'next';

const budgetService = new BudgetService();

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    const method = _req.method;
    const body = _req.body;
    try {
        switch (method) {
            case "POST":
                {
                    const newBudget: BudgetInput = JSON.parse(body);
                    const accountResponse = await budgetService.addBudget(newBudget);
                    res.status(200).json(JSON.stringify(accountResponse))
                }
                break;

            default:
                break;
        }

    } catch (err) {
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}

export default handler
