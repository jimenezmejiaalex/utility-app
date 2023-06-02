import { ShareWithUsersInput, UserSession } from '@/interfaces';
import { UserService } from '@/services/UserService';
import { NextApiRequest, NextApiResponse } from 'next';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

const userService = new UserService();

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    const method = _req.method;
    const body = _req.body;
    try {
        const session: Session = await getServerSession(_req, res, authOptions);
        console.log(session)
        const userSession: UserSession = session.user;
        switch (method) {
            case "PATCH":
                {

                    const input: ShareWithUsersInput = JSON.parse(body);
                    const expenseResponse = await userService
                        .shareWithUsers(userSession.email, input);
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
