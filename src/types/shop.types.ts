import { z } from 'zod';
import { BusinessType } from '@prisma/client';

export const NewShopSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  desc: z.string().min(1, 'Description is required'),
  street: z.string().min(1, 'Street is required'),
  businessType: z.nativeEnum(BusinessType, {
    message: 'Business type must be either retail or wholesale'
  }),
  buildingName: z.string().min(1, 'Building name is required'),
  shopNumber: z.string().min(1, 'Shop number is required'),
  image: z.string().min(1, 'URL is required')
});

export const ShopSchema = NewShopSchema.extend({
  id: z.string().uuid('Invalid shop ID format'),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const ShopUpdateDTOSchema = ShopSchema.partial().extend({});

export type NewShop = z.infer<typeof NewShopSchema> & { userId: string };
export type Shop = z.infer<typeof ShopSchema>;
export type ShopUpdateDTO = z.infer<typeof ShopUpdateDTOSchema>;
