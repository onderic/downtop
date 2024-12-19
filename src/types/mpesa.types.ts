import { z } from 'zod';

export const MpesaStkRequest = z.object({
  phone: z.string().regex(/^(07|01)\d{8}$/, {
    message: 'Phone number must start with 07 or 01 and be 10 digits long'
  }),
  shopId: z.string().min(1, { message: 'Shop ID is required' }),
  planId: z.string().min(1, { message: 'Plan ID is required' })
});

export type MpesaStkRequest = z.infer<typeof MpesaStkRequest>;
