import { BankAccountCreate } from '@/interfaces';
import { AccountService } from '@/services/AccountService';
import { NextApiRequest, NextApiResponse } from 'next';

const accountService = new AccountService();

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    const method = _req.method;
    const body = _req.body;
    const id = _req.query.id;
    try {
        switch (method) {
            case "PATCH":
                {
                    console.log(id);
                    const newAccount: BankAccountCreate = JSON.parse(body);
                    const accountResponse = await accountService.updateBankAccount(newAccount, parseInt(id.toString()));
                    res.status(200).json(JSON.stringify(accountResponse))
                }
                break;

            case "DELETE":
                {
                    console.log(id);
                    const accountResponse = await accountService.deleteBankAccount(parseInt(id.toString()));
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
