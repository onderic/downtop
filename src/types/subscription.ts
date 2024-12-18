import * as z from 'zod';
import { SubscriptionStatus } from '@prisma/client';
import { duration } from 'moment';
import { features } from 'process';

const subscription = z.object({
  id: z.string(),
  shopId: z.string(),
  planId: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  status: z.nativeEnum(SubscriptionStatus, {
    message: 'Status must be either active, paused, or cancelled'
  }),
  price: z.number(),
  createdAt: z.date(),
  updatedAt: z.date()
});

const plan = z.object({
  id: z.string(),
  name: z.string(),
  duration: z.number(),
  price: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  features: z.array(z.string())
});
export type Subscription = z.infer<typeof subscription>;
export type plan = z.infer<typeof plan>;
