import { productController } from '../../controllers';
import express from 'express';
import validate from '../../middlewares/validate';
import { NewProductSchema, ProductUpdateDTOSchema } from '../../types/product.types';
import auth from '../../middlewares/auth';

const router = express.Router();
router
  .route('/')
  .post(auth('createProduct', 'admin'), validate(NewProductSchema), productController.createProduct)
  .get(productController.getAllProducts);

router
  .route('/:productId')
  .get(productController.getProduct)
  .put(
    auth('updateProduct', 'admin'),
    validate(ProductUpdateDTOSchema),
    productController.updateProduct
  )
  .delete(auth('deleteProduct', 'admin'), productController.deleteProduct);

export default router;
