import { Reminder } from '@prisma/client';
import { ReminderDB } from './DBService';
export async function addReminder(reminder): Promise<Reminder> {
    try {
        const response = await ReminderDB.create({
            data: reminder
        });

        return response;
    } catch (error) {
        console.error(error);
        return null;
    }
}