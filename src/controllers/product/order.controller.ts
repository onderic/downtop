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

const updateOrderStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  const user = req.user as reqUser;

  const order = await orderService.getOrder(req.params.orderId);

  if (order.userId !== user.id && user.role !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to update this order');
  }

  const updatedOrder = await orderService.updateOrderStatus(order.id, status);
  res.status(httpStatus.OK).send(updatedOrder);
});

const getShopOrders = catchAsync(async (req, res) => {
  interface QueryParams {
    limit?: string;
    page?: string;
    totalAmount?: string;
    status?: string;
  }

  const { limit = '10', page = '1', totalAmount, status } = req.query as QueryParams;

  const shop = await orderService.getShopOrders({
    limit: parseInt(limit, 10),
    page: parseInt(page, 10),
    totalAmount: totalAmount ? parseFloat(totalAmount) : undefined,
    status,
    shopId: req.params.shopId
  });
  res.send(shop);
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
  getAllOrders,
  getShopOrders,
  updateOrderStatus
};
