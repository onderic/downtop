import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { categoryService } from '../../services';

const createCategory = catchAsync(async (req, res) => {
  const { name } = req.body;
  const category = await categoryService.createCategory({ name });
  res.status(httpStatus.CREATED).json(category);
});

const getAllCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  res.status(httpStatus.OK).json(categories);
});

const getCategoryById = catchAsync(async (req, res) => {
  const categoryId = Number(req.params.categoryId);
  const category = await categoryService.getCategoryById(categoryId);
  res.status(httpStatus.OK).json(category);
});

const updateCategory = catchAsync(async (req, res) => {
  const { name } = req.body;
  const categoryId = Number(req.params.categoryId);
  const category = await categoryService.updateCategory(categoryId, { name });
  res.status(httpStatus.OK).json(category);
});

const deleteCategory = catchAsync(async (req, res) => {
  const categoryId = Number(req.params.categoryId);
  await categoryService.deleteCategory(categoryId);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
