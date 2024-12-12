import { Role } from '@prisma/client';
import { z } from 'zod';

export const newUserSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  phone: z.string().min(10, { message: 'Contact number must be at least 10 digits long' }),
  role: z.nativeEnum(Role, { message: 'Role must be either admin, seller, or buyer' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
});

export const userSchema = newUserSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const safeUserSchema = userSchema.omit({ password: true });

export const userUpdateDTOSchema = userSchema.partial().extend({});

export type NewUser = z.infer<typeof newUserSchema>;
export type User = z.infer<typeof userSchema>;
export type UserUpdateDTO = z.infer<typeof userUpdateDTOSchema>;
export type SafeUser = z.infer<typeof safeUserSchema>;
