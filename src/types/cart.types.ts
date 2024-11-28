import { Product } from '@prisma/client';
import { z } from 'zod';

export const newCartItem = z.object({
  CartId: z.string(),
  ProductId: z.string(),
  quantity: z.number()
});
export const CartItem = newCartItem.extend({
  id: z.string(),
  amount: z.number(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const updateCartItemDTO = CartItem.pick({
  id: true,
  quantity: true
});
export const Cart = z.object({
  id: z.string(),
  userId: z.string(),
  items: z.array(CartItem),
  createdAt: z.date(),
  updatedAt: z.date()
});

export interface CartItemWithProduct extends CartItem {
  product: Product; // Include the product details
}

// Define the CartWithItemsAndProducts type
export type CartWithItemsAndProducts = Omit<Cart, 'items'> & {
  items: Array<CartItemWithProduct>; // Ensure items is an array of CartItemWithProduct
};
export type NewCartItem = z.infer<typeof newCartItem>;
export type CartItem = z.infer<typeof CartItem>;
export type Cart = z.infer<typeof Cart>;
