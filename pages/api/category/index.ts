import { CategoryInput, UserSession } from '@/interfaces';
import { CategoryService } from '@/services/CategoryService';
import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';

const categoryService = new CategoryService();

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    const method = _req.method;
    const body = _req.body;
    try {
        const session: Session = await getServerSession(_req, res, authOptions);
        console.log(session)
        const userSession: UserSession = session.user;
        switch (method) {
            case "POST":
                {

                    const newCategory: CategoryInput = JSON.parse(body);
                    const accountResponse = await categoryService
                        .addCategory(newCategory, userSession);
                    res.status(200).json(JSON.stringify(accountResponse))
                }
                break;

            case "GET":
                {
                    const categories = await categoryService.getCategories(userSession);
                    res.status(200).json(categories)
                }
                break;

            default:
                res.status(405).end(`Method ${method} Not Allowed`);
                break;
        }

    } catch (err) {
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}

export default handler
