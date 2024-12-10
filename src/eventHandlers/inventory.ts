import { eventEmitter } from '../utils/events';
import prisma from '../client';

eventEmitter.on('orderCreated', async ({ order }) => {
  try {
    await Promise.all(
      order.orderItems.map(async (item: { productId: string; quantity: number }) => {
        const prod = await prisma.product.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.quantity } }
        });
        console.log(
          `Updated inventory for product ID: ${item.productId}. New quantity: ${
            prod.quantity - item.quantity
          }`
        );
      })
    );
  } catch (error) {
    console.error('Error managing inventory:', error);
  }
});

export default eventEmitter;
