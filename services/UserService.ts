import { ShareWithUsersInput } from "@/interfaces";
import { User } from "@prisma/client";
import { NextApiRequest } from "next";
import { getSession } from "next-auth/react";
import { UserDB } from "./DBService";

export class UserService {

    async shareWithUsers(email: string, input: ShareWithUsersInput) {
        try {
            const users = await UserDB.findMany({
                where: {
                    email: {
                        in: input.usersForAccount.map(user => user.label)
                    }
                },
                select: {
                    id: true
                }
            });
            const user = await UserDB.update({
                where: {
                    email: email
                },
                data: {
                    users: {
                        set: users,
                    }
                }
            });
            return user;
        } catch (error) {
            console.error(error)
        }
    }
    async isSharedWith(request: NextApiRequest, userEmail: string) {
        try {
            const session = await getSession({ req: request });
            const userSession = session.user;
            const user = await UserDB.findUnique({
                where: {
                    email: userSession.email,
                },
                include: {
                    users: true
                }
            });
            return user.users.some(userDB => userDB.email === userEmail);
        } catch (exception) {
            console.error(exception)
        }
    }
    async getUsers(): Promise<Array<User>> {
        return await UserDB.findMany()
    }

    async getUserByEmail(email: string) {
        try {
            const user = await UserDB.findUniqueOrThrow({
                where: {
                    email: email
                },
                include: { users: true }
            });

            return user;
        } catch (error) {
            console.error(error)
        }
    }
}