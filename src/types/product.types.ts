// product.types.ts

import { z } from 'zod';

export const NewProductSchema = z.object({
  name: z.string(),
  quantity: z.number(),
  minPurchase: z.number(),
  description: z.string(),
  brand: z.string(),
  mktPrice: z.number(),
  sellingPrice: z.number(),
  size: z.string().optional(),
  colors: z.array(z.string()),
  img: z.string()
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
