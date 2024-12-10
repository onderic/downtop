import { Category } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../client';
import ApiError from '../../utils/ApiError';
import { NewCategory } from '../../types/category.types';

const createCategory = async (categoryData: NewCategory): Promise<Category> => {
  const category = await prisma.category.create({
    data: categoryData
  });
  return category;
};

const getAllCategories = async (): Promise<Category[]> => {
  const categories = await prisma.category.findMany();
  return categories;
};

const getCategoryById = async (id: number): Promise<Category | null> => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return category;
};

const updateCategory = async (id: number, categoryData: NewCategory): Promise<Category | null> => {
  const category = await prisma.category.update({ where: { id }, data: categoryData });
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return category;
};

const deleteCategory = async (id: number): Promise<Category | null> => {
  const category = await prisma.category.delete({ where: { id } });
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return category;
};

export default {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
