import { z } from 'zod';

export const NewCategorySchema = z.object({
  name: z.string().min(1, 'Name is required')
});

export const CategorySchema = NewCategorySchema.extend({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const CategoryUpdateDTOSchema = CategorySchema.partial().extend({});

export type NewCategory = z.infer<typeof NewCategorySchema>;
export type Category = z.infer<typeof CategorySchema>;
export type CategoryUpdateDTO = z.infer<typeof CategoryUpdateDTOSchema>;
