import { ExpenseInput } from '@/interfaces';
import { ExpenseService } from '@/services/ExpenseService';
import { NextApiRequest, NextApiResponse } from 'next';

const expenseService = new ExpenseService();

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    const method = _req.method;
    const body = _req.body;
    try {
        switch (method) {
            case "POST":
                {
                    const newExpense: ExpenseInput = JSON.parse(body);
                    const expenseResponse = await expenseService.addExpense(newExpense);
                    res.status(200).json(JSON.stringify(expenseResponse))
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
