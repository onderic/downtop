import { z } from 'zod';

// Define the NewOrderSchema
export const NewOrderSchema = z.object({
  userId: z.string(),
  orderItems: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
      totalPrice: z.number(),
      shopId: z.number() // Shop ID included here
    })
  ),
  totalAmount: z.number().positive(),
  placedAt: z.date().optional()
});

// Omit `shopId` from orderItems only
export const OrderWithoutShopIdSchema = NewOrderSchema.extend({
  orderItems: NewOrderSchema.shape.orderItems.element
    .omit({
      shopId: true
    })
    .array()
});

export type NewOrder = z.infer<typeof NewOrderSchema>;
export type OrderWithoutShopId = z.infer<typeof OrderWithoutShopIdSchema>;
