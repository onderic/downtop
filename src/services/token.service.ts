import { JwtPayload, JwtTokens, TokenTypes } from '../types/auth.types';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';
import prisma from '../client';
import axios from 'axios';
import logger from '../config/logger';
import exclude from '../utils/exclude';

const generateToken = async (userId: string, type: TokenTypes): Promise<string> => {
  const now = Math.floor(Date.now() / 1000);
  const exp =
    now +
    (type === 'access'
      ? config.jwt.accessExpirationMinutes * 60
      : config.jwt.refreshExpirationDays * 24 * 60 * 60);
  const iat = now;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

const generateOTP = async (userId: string): Promise<string> => {
  const otp_token = Math.floor(1000 + Math.random() * 9000).toString();
  await prisma.otp.deleteMany({
    where: {
      userId: userId
    }
  });
  await prisma.otp.create({
    data: {
      otp: otp_token,
      userId: userId,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    }
  });

  return otp_token;
};

export const generateDarajaTokens = async (consumerKey: string, consumerSecret: string) => {
  try {
    const response = await axios.get(config.mpesa.accessTokenUrl, {
      auth: {
        username: consumerKey,
        password: consumerSecret
      }
    });
    return response.data.access_token;
  } catch (error: any) {
    logger.error('Error generating Daraja tokens:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    throw new ApiError(500, 'Failed to generate Daraja tokens');
  }
};

const sendOTP = async (phone: string, otp: string): Promise<boolean> => {
  const payload = {
    mobile: phone,
    message: `Your OTP is ${otp}. It is valid for 5 minutes. Please do not share it with anyone.`,
    apikey: config.advanta.apiKey,
    partnerID: config.advanta.partnerId,
    shortcode: config.advanta.shortcode
  };

  try {
    const response = await axios.post(config.advanta.apiUrl, payload);

    if (
      response.status !== 200 ||
      response.data.responses[0]['response-description'] !== 'Success'
    ) {
      return false;
    }
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error('SMS API error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    } else {
      logger.error('Unexpected error:', error);
    }
    return false;
  }
};

const verifyOTP = async (phone: string, otp: string) => {
  const user = await prisma.user.findUnique({
    where: { phone }
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const otpDoc = await prisma.otp.findFirst({
    where: {
      userId: user.id,
      otp: otp
    }
  });

  if (!otpDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'OTP not found or invalid');
  }

  if (otpDoc.expiresAt < new Date()) {
    throw new ApiError(httpStatus.GONE, 'OTP has expired. Please request a new one.');
  }

  // Delete the OTP after verification
  await prisma.otp.delete({
    where: {
      id: otpDoc.id
    }
  });

  // Generate tokens and return user data
  const tokens = await genAuthtokens(user.id);
  const safeUser = exclude(user, ['id', 'password']);

  return {
    user: safeUser,
    tokens
  };
};

export default {
  generateToken,
  verifyToken,
  genAuthtokens,
  saveToken,
  deleteToken,
  generateOTP,
  generateDarajaTokens,
  verifyOTP,
  sendOTP
};
