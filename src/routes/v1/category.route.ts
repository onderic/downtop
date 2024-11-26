import { categoryController } from '../../controllers';
import express from 'express';
import validate from '../../middlewares/validate';
import { NewCategorySchema, CategoryUpdateDTOSchema } from '../../types/category.types';
import auth from '../../middlewares/auth';

const router = express.Router();

router
  .route('/')
  .post(
    auth('createCategory', 'admin'),
    validate(NewCategorySchema),
    categoryController.createCategory
  )
  .get(categoryController.getAllCategories);

router
  .route('/:categoryId')
  .get(categoryController.getCategoryById)
  .put(
    auth('updateCategory', 'admin'),
    validate(CategoryUpdateDTOSchema),
    categoryController.updateCategory
  )
  .delete(auth('deleteCategory'), categoryController.deleteCategory);

export default router;
