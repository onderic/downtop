import { Order, OrderStatus, Product } from '@prisma/client';
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

const getShopOrders = async ({
  shopId,
  limit,
  page,
  totalAmount,
  status
}: {
  shopId: string;
  limit: number;
  page: number;
  totalAmount?: number;
  status?: string;
}): Promise<{
  orders: Order[];
  totalOrders: number;
  totalPages: number;
  hasNextPage: boolean;
}> => {
  const skip = (page - 1) * limit;

  if (page < 1 || limit < 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Page and limit must be greater than 0');
  }

  const where: any = {
    orderItems: {
      some: {
        shopId: shopId
      }
    }
  };

  if (totalAmount !== undefined) {
    where.totalAmount = totalAmount;
  }
  if (status) {
    where.status = status;
  }

  const totalOrders = await prisma.order.count({
    where: where
  });

  const totalPages = Math.ceil(totalOrders / limit);

  // Fetch the orders with pagination
  const orders = await prisma.order.findMany({
    where: where,
    skip,
    take: limit,
    include: { orderItems: true },
    orderBy: { placedAt: 'desc' }
  });
  const hasNextPage = skip + limit < totalOrders;

  return {
    orders,
    totalOrders,
    totalPages,
    hasNextPage
  };
};

const getOrder = async (orderId: string): Promise<Order> => {
  if (!orderId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Order ID is required');
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { orderItems: true }
  });

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  return order;
};

const getAllOrders = async (): Promise<Order[]> => {
  return await prisma.order.findMany({
    include: { orderItems: true }
  });
};

const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order> => {
  return await prisma.order.update({
    where: { id: orderId },
    data: { status }
  });
};

export default {
  createOrder,
  getOrder,
  getAllOrders,
  getShopOrders,
  updateOrderStatus
};
