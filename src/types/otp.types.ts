import { z } from 'zod';

export const verifyOTPSchema = z.object({
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits long')
    .max(10, 'Phone number cannot exceed 10 digits'),
  otp: z
    .string()
    .length(4, 'OTP must be exactly 4 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers')
});

export type VerifyOTPRequest = z.infer<typeof verifyOTPSchema>;
