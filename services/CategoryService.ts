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

    async getCategories(): Promise<Array<Category>> {
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

    async getCategory(id: number): Promise<Category> {
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