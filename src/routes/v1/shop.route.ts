import { shopController } from '../../controllers';
import express from 'express';
import validate from '../../middlewares/validate';
import { NewShopSchema, ShopUpdateDTOSchema } from '../../types/shop.types';
import auth from '../../middlewares/auth';

const router = express.Router();

router
  .route('/')
  .post(auth('createShop', 'admin'), validate(NewShopSchema), shopController.createShop)
  .get(shopController.getShops);

router
  .route('/:shopId')
  .get(shopController.getShop)
  .put(auth('updateShop', 'admin'), validate(ShopUpdateDTOSchema), shopController.updateShop)
  .delete(auth('deleteShop', 'admin'), shopController.deleteShop);

export default router;
