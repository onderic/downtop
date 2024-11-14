import express from 'express';
import { authController } from '../../controllers';
import validate from '../../middlewares/validate';
import { LoginSchema } from '../../types/auth.types';

const router = express.Router();

router.post('/login', validate(LoginSchema), authController.loginUser);
router.post('/logout', authController.logoutUser);
router.post('/refresh-token', authController.refreshToken);

export default router;
