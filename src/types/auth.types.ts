import { z } from 'zod';
import { safeUserSchema } from './user.types';

export const JwtPayloadSchema = z.object({
  id: z.string().uuid('Invalid user ID format'),
  iat: z.number(),
  exp: z.number()
});

export const JwtTokenSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string()
});

export const LoginSchema = z.object({
  phone: z.string().min(1, 'phone is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

export const AuthResponseSchema = z.object({
  user: safeUserSchema,
  tokens: JwtTokenSchema
});

export const RefreshTokenDTOSchema = z.object({
  refreshToken: z.string()
});

// TypeScript types
export type JwtPayload = z.infer<typeof JwtPayloadSchema>;
export type JwtTokens = z.infer<typeof JwtTokenSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type RefreshTokenDTO = z.infer<typeof RefreshTokenDTOSchema>;
export type TokenTypes = 'access' | 'refresh';
