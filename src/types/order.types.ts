import { z } from 'zod';

export const NewOrderSchema = z.object({
  totalAmount: z.number().positive({ message: 'Total amount must be a positive number' }),
  orderItems: z.array(
    z.object({
      productId: z.string().uuid({ message: 'Invalid product ID format' }),
      quantity: z.number().min(1, { message: 'Quantity must be at least 1' })
    })
  )
});

export type NewOrder = z.infer<typeof NewOrderSchema> & { userId: string };
