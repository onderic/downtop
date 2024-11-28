import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { isPasswordMatch } from '../utils/encryption';
import tokenService from './token.service';
import { JwtTokens, Login } from '../types/auth.types';
import { getUser } from './user.service';
import { eventEmitter } from '../utils/events';

const loginUser = async (loginData: Login): Promise<void> => {
  const user = await getUser({ phone: loginData.phone });

  if (!user || !(await isPasswordMatch(loginData.password, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }

  const otp = await tokenService.generateOTP(user.id);
  eventEmitter.emit('sendOTP', { phone: user.phone, otp });
};

const logoutUser = async (userId: string, refreshToken: string): Promise<void> => {
  await tokenService.deleteToken(userId, refreshToken);
};

const refreshToken = async (userId: string, refreshToken: string): Promise<JwtTokens> => {
  await tokenService.deleteToken(userId, refreshToken);
  const tokens = await tokenService.genAuthtokens(userId);
  return tokens;
};
export default {
  loginUser,
  logoutUser,
  refreshToken
};
