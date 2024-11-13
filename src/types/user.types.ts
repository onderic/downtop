import { Role } from './enums';
import { z } from 'zod';

export const newUserSchema = z.object({
  username: z.string(),
  contact: z.number().min(10),
  role: z.nativeEnum(Role),
  password: z.string().min(8)
});

export const userSchema = newUserSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const userUpdateDTOSchema = userSchema.partial().extend({
  id: z.string()
});

export type NewUser = z.infer<typeof newUserSchema>;
export type User = z.infer<typeof userSchema>;
export type UserUpdateDTO = z.infer<typeof userUpdateDTOSchema>;
