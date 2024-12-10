import { productController } from '../../../controllers';
import express from 'express';
import validate from '../../../middlewares/validate';
import { NewProductSchema, ProductUpdateDTOSchema } from '../../../types/product.types';
import auth from '../../../middlewares/auth';

const router = express.Router();
router
  .route('/')
  .post(auth('createProduct'), validate(NewProductSchema), productController.createProduct)
  .get(productController.getAllProducts);

router
  .route('/:productId')
  .get(productController.getProduct)
  .put(
    auth('updateProduct', 'updateShop'),
    validate(ProductUpdateDTOSchema),
    productController.updateProduct
  )
  .delete(auth('deleteProduct', 'deleteProduct'), productController.deleteProduct);

export default router;
