import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { paymentService } from '../../services';

const lipaNaMpesa = catchAsync(async (req, res) => {
  const { phone, shopId } = req.body;
  const mpesaResponse = await paymentService.lipaNaMpesa({ phone, shopId });
  res.status(httpStatus.CREATED).send(mpesaResponse);
});

export default {
  lipaNaMpesa
};
