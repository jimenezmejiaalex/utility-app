import { User } from "@prisma/client";
import { UserDB } from "./DBService";

export class UserService {
    async getUsers(): Promise<Array<User>> {
        return await UserDB.findMany()
    }

    async getUserByEmail(email: string): Promise<User> {
        try {
            const user = await UserDB.findUniqueOrThrow({
                where: {
                    email: email
                }
            });

            return user;
        } catch (error) {
            console.error(error)
        }
    }
}