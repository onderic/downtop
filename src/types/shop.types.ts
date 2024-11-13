import { z } from 'zod';

export const NewShopSchema = z.object({
  desc: z.string().min(1, 'Description is required'),
  street: z.string().min(1, 'Street is required'),
  businessType: z.string().min(1, 'Business type is required'),
  buildingName: z.string().min(1, 'Building name is required'),
  shopNumber: z.string().min(1, 'Shop number is required'),
  userId: z.string().uuid('Invalid user ID format')
});

export const ShopSchema = NewShopSchema.extend({
  id: z.string().uuid('Invalid shop ID format'),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const ShopUpdateDTOSchema = ShopSchema.partial().extend({
  id: z.string().uuid('Invalid shop ID format')
});

// TypeScript types
export type NewShop = z.infer<typeof NewShopSchema>;
export type Shop = z.infer<typeof ShopSchema>;
export type ShopUpdateDTO = z.infer<typeof ShopUpdateDTOSchema>;
