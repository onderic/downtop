import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { paymentService } from '../../services';

const lipaNaMpesa = catchAsync(async (req, res) => {
  const { phone, shopId, planId } = req.body;
  const mpesaResponse = await paymentService.lipaNaMpesa({ phone, shopId, planId });
  res.status(httpStatus.CREATED).send(mpesaResponse);
});

const processCallback = catchAsync(async (req, res) => {
  await paymentService.processCallback(req.body);
  res.status(httpStatus.OK).send({ message: 'Callback processed successfully' });
});

export default {
  lipaNaMpesa,
  processCallback
};
