import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { subscriptionService } from '../../services';
import { SubscriptionStatus } from '@prisma/client';

const getShopSubscriptions = catchAsync(async (req, res) => {
  const { shopId } = req.params;
  const {
    page = '1',
    limit = '10',
    status
  } = req.query as { page: string; limit: string; status?: SubscriptionStatus };
  const subscriptions = await subscriptionService.getShopSubscriptions(
    shopId,
    parseInt(page, 10),
    parseInt(limit, 10),
    status
  );
  res.send(subscriptions);
});

const getAllSubscriptions = catchAsync(async (req, res) => {
  const {
    page = '1',
    limit = '10',
    planId,
    shopId
  } = req.query as { page: string; limit: string; planId?: string; shopId?: string };
  const subscriptions = await subscriptionService.getAllSubscriptions(
    parseInt(page, 10),
    parseInt(limit, 10),
    planId,
    shopId
  );
  res.send(subscriptions);
});

const getSubscriptionById = catchAsync(async (req, res) => {
  const subscription = await subscriptionService.getSubscriptionById(req.params.subscriptionId);
  res.send(subscription);
});

const createPlan = catchAsync(async (req, res) => {
  const plan = await subscriptionService.createPlan(req.body);
  res.status(httpStatus.CREATED).send(plan);
});

const updatePlan = catchAsync(async (req, res) => {
  const plan = await subscriptionService.updatePlan(req.params.planId, req.body);
  res.send(plan);
});

const getPlanById = catchAsync(async (req, res) => {
  const plan = await subscriptionService.getPlanById(req.params.planId);
  res.send(plan);
});

const getAllPlans = catchAsync(async (req, res) => {
  const result = await subscriptionService.getAllPlans();
  res.send(result);
});

const deletePlan = catchAsync(async (req, res) => {
  await subscriptionService.removePlan(req.params.planId);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  getShopSubscriptions,
  getSubscriptionById,
  createPlan,
  updatePlan,
  getPlanById,
  getAllPlans,
  getAllSubscriptions,
  deletePlan
};
