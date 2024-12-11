import { Order, Product } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../client';
import ApiError from '../../utils/ApiError';
import { NewOrder } from '../../types/order.types';
import { eventEmitter } from '../../utils/events';

const createOrder = async (orderData: NewOrder): Promise<Order> => {
  const order = await prisma.$transaction(async (prisma) => {
    const newOrder = await prisma.order.create({
      data: {
        userId: orderData.userId,
        totalAmount: orderData.totalAmount
      }
    });

    const orderItems = await Promise.all(
      orderData.orderItems.map(async (item) => {
        const product: Product | null = await prisma.product.findUnique({
          where: { id: item.productId }
        });

        if (!product) {
          throw new ApiError(httpStatus.NOT_FOUND, `Product not found`);
        }

        return prisma.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            totalPrice: item.quantity * product.sellingPrice,
            shopId: product.shopId
          }
        });
      })
    );

    return { ...newOrder, orderItems };
  });

  eventEmitter.emit('orderCreated', { order });

  return order;
};

const getShopOrders = async (shopId: string): Promise<Order[]> => {
  return await prisma.order.findMany({
    where: {
      orderItems: {
        some: {
          shopId: shopId
        }
      }
    },
    include: { orderItems: true }
  });
};

const getOrder = async (orderId: string): Promise<Order> => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { orderItems: true }
  });

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'order not found');
  }
  return order;
};

const getAllOrders = async (): Promise<Order[]> => {
  return await prisma.order.findMany({
    include: { orderItems: true }
  });
};

export default {
  createOrder,
  getOrder,
  getAllOrders,
  getShopOrders
};
