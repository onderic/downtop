import { paymentController } from '../../../controllers';
import express from 'express';
import validate from '../../../middlewares/validate';
import { MpesaStkRequest } from '../../../types/mpesa.types';
import auth from '../../../middlewares/auth';

const router = express.Router();

router.route('/').post(auth(), validate(MpesaStkRequest), paymentController.lipaNaMpesa);
router.route('/callback').post(paymentController.processCallback);
router.route('/verify').post(paymentController.verifyTransaction);
router.route('/transactionstatus/result').post(paymentController.resultCallback);
router.route('/timeout').post(paymentController.timeoutCallback);

export default router;
