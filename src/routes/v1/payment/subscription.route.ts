import { Router } from 'express';
import auth from '../../../middlewares/auth';
import { subscriptionController } from '../../../controllers';
import validate from '../../../middlewares/validate';
import { newPlanSchema, updatePlanSchema } from '../../../types/subscription';

const router = Router();

router.route('/').get(auth('getAllSubscriptions'), subscriptionController.getAllSubscriptions);

router
  .route('/shop/:shopId')
  .get(auth('getShopSubscriptions'), subscriptionController.getShopSubscriptions);

router
  .route('/id/:subscriptionId')
  .get(auth('getSubscription'), subscriptionController.getSubscriptionById);

router
  .route('/plans')
  .get(auth('getAllPlans'), subscriptionController.getAllPlans)
  .post(auth('createPlan'), validate(newPlanSchema), subscriptionController.createPlan);

router
  .route('/plans/:planId')
  .get(auth('getPlan'), subscriptionController.getPlanById)
  .patch(auth('updatePlan'), validate(updatePlanSchema), subscriptionController.updatePlan)
  .delete(auth('deletePlan'), subscriptionController.deletePlan);

export default router;
