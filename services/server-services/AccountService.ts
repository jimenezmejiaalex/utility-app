import { BankAccountCreate, UserSession } from '@/interfaces'
import { BankAccountDB } from '@/services/server-services/DBService'
import { UserService } from '@/services/server-services/UserService'
import { BankAccount } from '@prisma/client'

export class AccountService {
    private userService = new UserService()

    async addBankAccount(bankAccount: BankAccountCreate): Promise<BankAccount> {
        try {
            const user = await this.userService.getUserByEmail(
                bankAccount.email
            )
            const userId = user.id

            return await BankAccountDB.create({
                data: {
                    name: bankAccount.name,
                    currency: bankAccount.currency,
                    amount: bankAccount.amount,
                    userId: userId,
                },
            })
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async getAccountsByIds(ids: Array<number>): Promise<Array<{ id: string }>> {
        try {
            return await BankAccountDB.findMany({
                select: {
                    id: true,
                },
                where: {
                    accountId: {
                        in: ids,
                    },
                },
            })
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async updateBankAccount(
        bankAccount: BankAccountCreate,
        id: number
    ): Promise<BankAccount> {
        try {
            const user = await this.userService.getUserByEmail(
                bankAccount.email
            )
            const userId = user.id
            return await BankAccountDB.update({
                where: {
                    accountId: id,
                },
                data: {
                    name: bankAccount.name,
                    currency: bankAccount.currency,
                    amount: bankAccount.amount,
                    userId: userId,
                },
            })
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async deleteBankAccount(id: number): Promise<BankAccount> {
        try {
            return await BankAccountDB.delete({
                where: {
                    accountId: id,
                },
            })
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async getBankAccounts(
        userSession: UserSession
    ): Promise<Array<BankAccount>> {
        try {
            const user = await this.userService.getUserByEmail(
                userSession.email
            )
            const response = await BankAccountDB.findMany({
                select: {
                    id: true,
                    accountId: true,
                    amount: true,
                    name: true,
                    currency: true,
                    userId: true,
                    User: {
                        select: {
                            email: true,
                            users: {
                                select: {
                                    email: true,
                                },
                            },
                        },
                    },
                },
            })
            console.log(user, response)
            return response.filter(
                (account) =>
                    account.User.email === userSession.email ||
                    user.users.some((u) => account.User.email === u.email)
            )
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async getBankAccountById(id: number, userSession: UserSession) {
        try {
            const response = await BankAccountDB.findFirst({
                where: {
                    accountId: id,
                },
                select: {
                    accountId: true,
                    amount: true,
                    name: true,
                    currency: true,
                    User: {
                        select: {
                            email: true,
                            users: {
                                select: {
                                    email: true,
                                },
                            },
                        },
                    },
                },
            })

            if (
                response.User.email === userSession.email ||
                response.User.users.some((u) => u.email === userSession.email)
            ) {
                return response
            }
            return null
        } catch (error) {
            console.error(error)
            return null
        }
    }
}
