// product.types.ts

import { z } from 'zod';

export const NewProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  quantity: z.number().int('Quantity must be an integer').positive('Quantity must be positive'),
  minPurchase: z.number().positive('Minimum purchase must be positive'),
  description: z.string().min(1, 'Description is required'),
  brand: z.string().min(1, 'Brand is required'),
  mktPrice: z.number().positive('Market price must be positive'),
  sellingPrice: z.number().positive('Selling price must be positive'),
  size: z.string().min(1, 'Size is required'),
  colors: z.array(z.string().min(1, 'Color is required')),
  img: z.string().min(1, 'Image URL is required')
});

export const ProductSchema = NewProductSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const ProductUpdateDTOSchema = ProductSchema.partial().extend({
  id: z.string()
});

export type NewProduct = z.infer<typeof NewProductSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type ProductUpdateDTO = z.infer<typeof ProductUpdateDTOSchema>;
