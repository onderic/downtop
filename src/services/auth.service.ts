import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { isPasswordMatch } from '../utils/encryption';
import tokenService from './token.service';
import { AuthResponse, JwtTokens, Login } from '../types/auth.types';
import { getUser } from './user.service';
import exclude from '../utils/exclude';

const loginUser = async (loginData: Login): Promise<AuthResponse> => {
  const user = await getUser({ phone: loginData.phone });

  if (!user || !(await isPasswordMatch(loginData.password, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }

  const safeUser = exclude(user, ['password']);
  const otp = await tokenService.generateOTP(user.id);
  tokenService.sendOTP(user.phone, otp);
  const tokens = await tokenService.genAuthtokens(user.id);
  return { user: safeUser, tokens: tokens };
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
