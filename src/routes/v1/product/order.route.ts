import { orderController } from '../../../controllers';
import express from 'express';
import validate from '../../../middlewares/validate';
import { NewOrderSchema } from '../../../types/order.types';
import auth from '../../../middlewares/auth';

const router = express.Router();
router
  .route('/')
  .post(auth(), validate(NewOrderSchema), orderController.createOrder)
  .get(auth('admin'), orderController.getAllOrders);

export default router;
