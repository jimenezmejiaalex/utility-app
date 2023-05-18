import { addReminder } from '@/services/ReminderService';
import { NextApiRequest, NextApiResponse } from 'next';
import { sampleUserData } from '../../../utils/sample-data';

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    const method = _req.method;
    const body = _req.body;
    try {
        switch (method) {
            case "POST":
                {
                    const newReminder = JSON.parse(body)
                    const reminderResponse = await addReminder({
                        name: newReminder["name"],
                        assignedAt: new Date(newReminder["assignedAt"]),
                        assignedBy: newReminder["assignedBy"]
                    });
                    console.log(reminderResponse);
                }
                break;

            default:
                break;
        }

        res.status(200).json(sampleUserData)
    } catch (err: any) {
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}

export default handler
