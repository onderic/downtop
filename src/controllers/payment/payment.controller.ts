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

const verifyTransaction = catchAsync(async (req, res) => {
  const { mpesaReceiptNumber } = req.body;
  const response = await paymentService.verifyTransaction(mpesaReceiptNumber);
  res.send(response);
});

const resultCallback = catchAsync(async (req, res) => {
  const response = paymentService.resultCallback(req.body);
  res.send(response);
});

const timeoutCallback = catchAsync(async (req, res) => {
  const response = paymentService.timeoutCallback(req.body);
  res.send(response);
});

export default {
  lipaNaMpesa,
  processCallback,
  verifyTransaction,
  resultCallback,
  timeoutCallback
};
