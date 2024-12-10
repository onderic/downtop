import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { orderService } from '../../services';
import { reqUser } from '../../types/request.types';
import ApiError from '../../utils/ApiError';

const createOrder = catchAsync(async (req, res) => {
  const { totalAmount, orderItems } = req.body;

  const user = req.user as reqUser;

  if (user.role !== 'buyer') {
    throw new ApiError(httpStatus.FORBIDDEN, 'User is not authorized to make an order');
  }

  const orderData = {
    userId: user.id,
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
