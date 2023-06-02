import { BankAccountCreate } from '@/interfaces';
import { AccountService } from '@/services/AccountService';
import { NextApiRequest, NextApiResponse } from 'next';

const accountService = new AccountService();

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    const method = _req.method;
    const body = _req.body;

    try {
        switch (method) {
            case "POST":
                {
                    const newAccount: BankAccountCreate = JSON.parse(body);
                    const accountResponse = await accountService.addBankAccount(newAccount);
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
