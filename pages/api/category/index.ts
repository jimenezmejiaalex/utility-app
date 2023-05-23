import { CategoryInput } from '@/interfaces';
import { CategoryService } from '@/services/CategoryService';
import { NextApiRequest, NextApiResponse } from 'next';

const categoryService = new CategoryService();

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    const method = _req.method;
    const body = _req.body;
    try {
        switch (method) {
            case "POST":
                {
                    const newCategory: CategoryInput = JSON.parse(body);
                    const accountResponse = await categoryService.addCategory(newCategory);
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
