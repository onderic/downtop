import { Router } from 'express';
import auth from '../../../middlewares/auth';
import { subscriptionController } from '../../../controllers';

const router = Router();

router.route('/').get(auth('getAllSubscriptions'), subscriptionController.getAllSubscriptions);
router
  .route('/:shopId')
  .get(auth('getShopSubscriptions'), subscriptionController.getShopSubscriptions);
router
  .route('/:subscriptionId')
  .get(auth('getSubscription'), subscriptionController.getSubscriptionById);
router
  .route('/plans')
  .get(auth('getAllPlans'), subscriptionController.getAllPlans)
  .post(auth('createPlan'), subscriptionController.createPlan);
router
  .route('/plans/:planId')
  .get(auth('getPlan'), subscriptionController.getPlanById)
  .patch(auth('updatePlan'), subscriptionController.updatePlan)
  .delete(auth('deletePlan'), subscriptionController.deletePlan);

export default router;
