import { userController } from '../../controllers';
import express from 'express';
import validate from '../../middlewares/validate';
import { newUserSchema, userUpdateDTOSchema } from '../../types/user.types';
import passport from 'passport';

const router = express.Router();

router.post('/register', validate(newUserSchema), userController.createUser);
router.get('/', passport.authenticate('jwt', { session: false }), userController.getAllUsers);
router.get('/:userId', passport.authenticate('jwt', { session: false }), userController.getUser);
router.patch(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  validate(userUpdateDTOSchema),
  userController.updateUser
);
router.delete(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  userController.deleteUser
);

export default router;
