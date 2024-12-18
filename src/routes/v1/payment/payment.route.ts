import { paymentController } from '../../../controllers';
import express from 'express';
import validate from '../../../middlewares/validate';
import { MpesaStkRequest } from '../../../types/mpesa.types';
import auth from '../../../middlewares/auth';

const router = express.Router();

router.route('/').post(auth(), validate(MpesaStkRequest), paymentController.lipaNaMpesa);
router.route('/callback').post(paymentController.processCallback);

export default router;
