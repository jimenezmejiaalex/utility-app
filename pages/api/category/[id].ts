import { CategoryInput } from '@/interfaces';
import { CategoryService } from '@/services/CategoryService';
import { NextApiRequest, NextApiResponse } from 'next';

const categoryService = new CategoryService();

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    const method = _req.method;
    const body = _req.body;
    const id = _req.query.id;
    try {
        switch (method) {
            case "PATCH":
                {

                    const newCategory: CategoryInput = JSON.parse(body);
                    const accountResponse = await categoryService.updateCategory(newCategory, parseInt(id.toString()));
                    res.status(200).json(JSON.stringify(accountResponse))
                }
                break;

            case "DELETE":
                {

                    const accountResponse = await categoryService.deleteCategory(parseInt(id.toString()));
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
