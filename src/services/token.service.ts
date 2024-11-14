import { JwtPayload, JwtTokens, TokenTypes } from '../types/auth.types';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';
import prisma from '../client';

const generateToken = async (userId: string, type: TokenTypes): Promise<string> => {
  const exp =
    Math.floor(Date.now() / 1000) +
    (type === 'access'
      ? config.jwt.accessExpirationMinutes * 60
      : config.jwt.refreshExpirationDays * 24 * 60 * 60);
  const iat = Math.floor(Date.now() / 1000);
  const payload: JwtPayload = {
    id: userId,
    iat: iat,
    exp: exp
  };
  const token = jwt.sign(payload, config.jwt.secret);
  if (type === 'refresh') {
    await saveToken(userId, token, new Date(payload.exp * 1000).toISOString());
  }
  return token;
};

const genAuthtokens = async (userId: string): Promise<JwtTokens> => {
  const access = await generateToken(userId, 'access');
  const refresh = await generateToken(userId, 'refresh');
  return { accessToken: access, refreshToken: refresh };
};

const saveToken = async (
  userId: string,
  refreshToken: string,
  expiresAt: string
): Promise<void> => {
  const tokenDoc = await prisma.token.create({
    data: {
      token: refreshToken,
      userId: userId,
      expiresAt: new Date(expiresAt)
    }
  });
};
const deleteToken = async (userId: string, refreshToken: string): Promise<void> => {
  const tokenDoc = await prisma.token.findFirst({
    where: {
      userId: userId,
      token: refreshToken
    }
  });

  if (!tokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Token not found or invalid');
  }

  await prisma.token.delete({
    where: {
      id: tokenDoc.id
    }
  });
};

const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
  }
};

export default {
  generateToken,
  verifyToken,
  genAuthtokens,
  saveToken,
  deleteToken
};
