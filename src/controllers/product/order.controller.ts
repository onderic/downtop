import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { orderService } from '../../services';

const createOrder = catchAsync(async (req, res) => {
  const { userId, totalAmount, orderItems } = req.body;

  const orderData = {
    userId,
    totalAmount,
    orderItems
  };

  const order = await orderService.createOrder(orderData);
  res.status(httpStatus.CREATED).send(order);
});

const getOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrder(req.params.orderId);
  res.status(httpStatus.OK).send(order);
});

const getAllOrders = catchAsync(async (req, res) => {
  const result = await orderService.getAllOrders();
  res.status(httpStatus.OK).send(result);
});

export default {
  createOrder,
  getOrder,
  getAllOrders
};
