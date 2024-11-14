import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { isPasswordMatch } from '../utils/encryption';
import { SafeUser } from '../types/user.types';
import tokenService from './token.service';
import { AuthResponse, Login } from '../types/auth.types';
import { getUser } from './user.service';
import exclude from '../utils/exclude';

const loginUser = async (loginData: Login): Promise<AuthResponse> => {
  const user = await getUser({ phone: loginData.phone });

  if (!user || !(await isPasswordMatch(loginData.password, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }

  const safeUser = exclude(user, ['password']);
  const tokens = await tokenService.genAuthtokens(user.id);

  return { user: safeUser, tokens: tokens };
};

const logoutUser = async (userId: string, refreshToken: string): Promise<void> => {
  await tokenService.deleteToken(userId, refreshToken);
};

const refreshToken = async (
  userId: string,
  refreshToken: string
): Promise<{ refreshToken: string }> => {
  await tokenService.deleteToken(userId, refreshToken);
  const token = await tokenService.generateToken(userId, 'refresh');
  return { refreshToken: token };
};
export default {
  loginUser,
  logoutUser,
  refreshToken
};
