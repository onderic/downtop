import httpStatus from 'http-status';
import prisma from '../../client';
import ApiError from '../../utils/ApiError';
import { plan, Subscription } from '../../types/subscription';
import { SubscriptionStatus } from '@prisma/client';

const createSubscription = async (subscriptionData: Subscription): Promise<Subscription> => {
  const shop = await prisma.shop.findUnique({
    where: { id: subscriptionData.shopId }
  });

  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop not found');
  }

  const subscription = await prisma.subscription.create({
    data: {
      shopId: shop.id,
      planId: subscriptionData.planId,
      endDate: new Date(),
      price: subscriptionData.price,
      status: subscriptionData.status
    }
  });

  return subscription;
};

const getShopSubscriptions = async (
  shopId: string,
  page: number,
  limit: number,
  status?: SubscriptionStatus
): Promise<{ subscriptions: Subscription[]; total: number }> => {
  const shop = await prisma.shop.findUnique({
    where: { id: shopId }
  });

  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop not found');
  }

  const skip = (page - 1) * limit;
  const where = status ? { shopId, status } : { shopId };
  const [subscriptions, total] = await prisma.$transaction([
    prisma.subscription.findMany({
      skip,
      take: limit,
      where
    }),
    prisma.subscription.count({ where })
  ]);

  return { subscriptions, total };
};
const getAllSubscriptions = async (
  page: number,
  limit: number,
  planId?: string,
  shopId?: string
): Promise<{ subscriptions: Subscription[]; total: number }> => {
  const skip = (page - 1) * limit;
  const where: any = {};
  if (planId) where.planId = planId;
  if (shopId) where.shopId = shopId;

  const [subscriptions, total] = await prisma.$transaction([
    prisma.subscription.findMany({
      skip,
      take: limit,
      where
    }),
    prisma.subscription.count({ where })
  ]);

  return { subscriptions, total };
};
const updateSubscriptionStatus = async (
  subscriptionId: string,
  status: SubscriptionStatus
): Promise<Subscription> => {
  const subscription = await prisma.subscription.update({
    where: { id: subscriptionId },
    data: { status }
  });

  return subscription;
};

const getSubscriptionById = async (subscriptionId: string): Promise<Subscription> => {
  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId }
  });

  if (!subscription) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subscription not found');
  }

  return subscription;
};
const createPlan = async (planData: plan): Promise<plan> => {
  const plan = await prisma.plan.create({
    data: planData
  });

  return plan;
};

const updatePlan = async (planId: string, updateBody: plan): Promise<plan> => {
  const plan = await prisma.plan.update({
    where: { id: planId },
    data: updateBody
  });

  return plan;
};

const removePlan = async (planId: string): Promise<void> => {
  await prisma.plan.delete({
    where: { id: planId }
  });
};

const getAllPlans = async (): Promise<plan[]> => {
  const plans = await prisma.plan.findMany();
  return plans;
};

const getPlanById = async (planId: string): Promise<plan> => {
  const plan = await prisma.plan.findUnique({
    where: { id: planId }
  });

  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');
  }

  return plan;
};

export default {
  createSubscription,
  getShopSubscriptions,
  getSubscriptionById,
  createPlan,
  updatePlan,
  removePlan,
  getAllPlans,
  getPlanById,
  updateSubscriptionStatus,
  getAllSubscriptions
};
