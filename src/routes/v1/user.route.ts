import { userController } from '../../controllers';
import express from 'express';
import validate from '../../middlewares/validate';
import { newUserSchema, userUpdateDTOSchema } from '../../types/user.types';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/register', validate(newUserSchema), userController.createUser);
router.get('/', auth('getallUsers'), userController.getAllUsers);
router.get('/:userId', auth(), userController.getUser);
router.patch('/:userId', auth(), validate(userUpdateDTOSchema), userController.updateUser);
router.delete('/:userId', auth(), userController.deleteUser);

export default router;
