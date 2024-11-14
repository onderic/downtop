import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';
import authService from '../../services/auth.service';
import { Login } from '../../types/auth.types';
import tokenService from '../../services/token.service';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const loginData: Login = req.body;
  const { user, tokens } = await authService.loginUser(loginData);
  res.status(httpStatus.OK).json({ user, tokens });
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
  refreshToken
};
