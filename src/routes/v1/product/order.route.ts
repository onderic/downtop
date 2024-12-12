import { orderController } from '../../../controllers';
import express from 'express';
import validate from '../../../middlewares/validate';
import { NewOrderSchema, UpdateOrderSchema } from '../../../types/order.types';
import auth from '../../../middlewares/auth';

const router = express.Router();
router
  .route('/')
  .post(auth(), validate(NewOrderSchema), orderController.createOrder)
  .get(auth('admin'), orderController.getAllOrders);

router
  .route('/:orderId')
  .patch(auth('updateorder'), validate(UpdateOrderSchema), orderController.updateOrderStatus);

router.route('/:shopId').get(auth('getorders'), orderController.getShopOrders);

export default router;
