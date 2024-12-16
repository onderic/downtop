import { z } from 'zod';

export const Mpesa = z.object({
  phone: z.string().regex(/^(07|01)\d{8}$/, {
    message: 'Phone number must start with 07 or 01 and be 10 digits long'
  }),
  shopId: z.string().min(1, { message: 'Shop ID is required' })
});

export type Mpesa = z.infer<typeof Mpesa>;
