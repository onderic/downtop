import { userController } from '../../controllers';
import express from 'express';
import validate from '../../middlewares/validate';
import { newUserSchema, userUpdateDTOSchema } from '../../types/user.types';

const router = express.Router();

router.post('/register', validate(newUserSchema), userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:userId', userController.getUser);
router.patch('/:userId', validate(userUpdateDTOSchema), userController.updateUser);
router.delete('/:userId', userController.deleteUser);

export default router;
