import { CategoryInput } from '@/interfaces';
import { CategoryDB } from '@/services/DBService';
import { Category } from '@prisma/client';

export class CategoryService {

    async addCategory(category: CategoryInput): Promise<Category> {
        try {
            const response = await CategoryDB.create({
                data: category
            });

            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async updateCategory(category: CategoryInput, id: number): Promise<Category> {
        try {
            const response = await CategoryDB.update({
                where: {
                    categoryId: id
                },
                data: category
            });

            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getCategories() {
        try {
            const response = await CategoryDB.findMany({
                select: {
                    id: true,
                    categoryId: true,
                    name: true,
                    type: true
                }
            });

            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getCategoriesByIds(ids: Array<number>): Promise<Array<{ id: string }>> {
        try {
            const response = await CategoryDB.findMany({
                where: {
                    categoryId: {
                        in: ids
                    }
                },
                select: {
                    id: true,
                }
            });

            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getCategoriesByBudgetIdAndExpenseCreateAtRange(budgetId: number, from: string, to: string) {
        try {
            const response = await CategoryDB.findMany({
                where: {
                    expenses: {
                        every: {
                            budget: {
                                budgetId: budgetId
                            }
                            // AND: [
                            //     {
                            //         budget: {
                            //             budgetId: budgetId
                            //         }
                            //     },
                            //     {
                            //         createdAt: {
                            //             gte: new Date(from),
                            //             lt: new Date(to)
                            //         }
                            //     }
                            // ]
                        }
                    }
                },
                select: {
                    name: true,
                    expenses: {
                        select: {
                            name: true,
                            amount: true,
                            currency: true,
                            createdAt: true,
                            budget: {
                                select: {
                                    budgetId: true,
                                    name: true,
                                    amount: true,
                                    currency: true
                                }
                            }
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

    async getCategory(id: number) {
        try {
            const response = await CategoryDB.findFirst({
                where: {
                    categoryId: id
                },
                select: {
                    id: true,
                    categoryId: true,
                    name: true,
                    type: true
                }
            });

            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async deleteCategory(id: number): Promise<Category> {
        try {
            const response = await CategoryDB.delete({
                where: {
                    categoryId: id
                }
            });

            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}