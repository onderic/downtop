import { cartController } from '../../controllers';
import express from 'express';
import validate from '../../middlewares/validate';
import auth from '../../middlewares/auth';
import { newCartItem, updateCartItemDTO } from '../../types/cart.types';

const router = express.Router();

router.route('/').post(auth(), cartController.createCart);

router
  .route('/:cartId')
  .post(auth(), validate(newCartItem), cartController.addCartItem)
  .patch(auth(), validate(updateCartItemDTO), cartController.updateCartItem)
  .get(auth(), cartController.getCart)
  .delete(auth(), cartController.deleteCartItem);
router.route('/clear/:cartId').delete(auth(), cartController.clearCart);

export default router;
