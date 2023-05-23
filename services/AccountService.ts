import { BankAccountCreate } from '@/interfaces';
import { BankAccountDB } from '@/services/DBService';
import { UserService } from '@/services/UserService';
import { BankAccount } from '@prisma/client';

export class AccountService {
    private userService = new UserService();

    async addBankAccount(bankAccount: BankAccountCreate): Promise<BankAccount> {
        try {
            const user = await this.userService.getUserByEmail(bankAccount.email);
            const userId = user.id;
            const response = await BankAccountDB.create({
                data: {
                    name: bankAccount.name,
                    currency: bankAccount.currency,
                    amount: bankAccount.amount,
                    userId: userId
                }
            });

            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getAccountsByIds(ids: Array<number>): Promise<Array<{ id: string }>> {
        try {
            console.log(ids)
            const response = await BankAccountDB.findMany({
                select: {
                    id: true,
                },
                where: {
                    accountId: {
                        in: ids
                    }
                }
            });

            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async updateBankAccount(bankAccount: BankAccountCreate, id: number): Promise<BankAccount> {
        try {
            const user = await this.userService.getUserByEmail(bankAccount.email);
            const userId = user.id;
            const response = await BankAccountDB.update({
                where: {
                    accountId: id
                },
                data: {
                    name: bankAccount.name,
                    currency: bankAccount.currency,
                    amount: bankAccount.amount,
                    userId: userId
                }
            });

            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async deleteBankAccount(id: number): Promise<BankAccount> {
        try {
            const response = await BankAccountDB.delete({
                where: {
                    accountId: id
                }
            });

            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getBankAccounts(): Promise<Array<BankAccount>> {
        try {
            const response = await BankAccountDB.findMany({
                select: {
                    id: true,
                    accountId: true,
                    amount: true,
                    name: true,
                    currency: true,
                    userId: true,
                }
            });

            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getBankAccountById(id: number) {
        try {
            const response = await BankAccountDB.findFirst({
                where: {
                    accountId: id
                },
                select: {
                    accountId: true,
                    amount: true,
                    name: true,
                    currency: true,
                    User: {
                        select: {
                            email: true
                        }
                    }
                }
            });

            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}