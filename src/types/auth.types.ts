import { z } from 'zod';
import { userSchema } from './user.types';
import { Role } from './enums';

export const JwtPayloadSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  username: z.string().min(1, 'Username is required'),
  role: z.nativeEnum(Role),
  iat: z.number(),
  exp: z.number()
});

export const JwtTokenSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string()
});

export const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

export const AuthResponseSchema = z.object({
  user: userSchema,
  token: JwtTokenSchema
});

export const RefreshTokenDTOSchema = z.object({
  refreshToken: z.string()
});

// TypeScript types
export type JwtPayload = z.infer<typeof JwtPayloadSchema>;
export type JwtToken = z.infer<typeof JwtTokenSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type RefreshTokenDTO = z.infer<typeof RefreshTokenDTOSchema>;
