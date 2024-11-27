import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';
import authService from '../../services/auth.service';
import tokenService from '../../services/token.service';
import { Login } from '../../types/auth.types';
import userService from '../../services/user.service';
import exclude from '../../utils/exclude';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const loginData: Login = req.body;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = await authService.loginUser(loginData);
  res.status(httpStatus.OK).json({ message: 'user available' });
});

const verifyOTPtoken = catchAsync(async (req: Request, res: Response) => {
  const { phone, otp } = req.body;
  const user = await userService.getUser({ phone: phone });
  if (!user) {
    return;
  }
  await tokenService.verifyOTP(user?.id, otp);
  const tokens = await tokenService.genAuthtokens(user.id);
  const userWithoutPassword = exclude(user, ['password']);
  res.status(httpStatus.OK).json({ user: userWithoutPassword, tokens });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  const { userId, refreshToken } = req.body;
  await authService.logoutUser(userId, refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { userId, refreshToken } = req.body;
  const refreshedToken = await authService.refreshToken(userId, refreshToken);
  res.status(httpStatus.OK).json(refreshedToken);
});

export default {
  loginUser,
  logoutUser,
  refreshToken,
  verifyOTPtoken
};
