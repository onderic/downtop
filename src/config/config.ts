import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const envVarsSchema = z.object({
  APP_URL: z.string(),
  NODE_ENV: z.enum(['production', 'development', 'test']),
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('3000'),
  JWT_SECRET: z.string(),
  JWT_ACCESS_EXPIRATION_MINUTES: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('30'),
  JWT_REFRESH_EXPIRATION_DAYS: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('30'),
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('10'),
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('10'),
  ADVANTA_API_KEY: z.string(),
  ADVANTA_PARTNER_ID: z.string(),
  ADVANTA_API_URL: z.string(),
  ADVANTA_SHORTCODE: z.string(),
  MPESA_SHORTCODE: z.string(),
  MPESA_CONSUMER_KEY: z.string(),
  MPESA_CONSUMER_SECRET: z.string(),
  MPESA_PASSKEY: z.string(),
  MPESA_ACCESS_TOKEN_URL: z.string(),
  MPESA_STK_PUSH_URL: z.string(),
  MPESA_CALLBACK_URL: z.string(),
  MPESA_VERIFY_TRANSACTION: z.string()
});

const parsedEnv = envVarsSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(`Config validation error: ${JSON.stringify(parsedEnv.error.format(), null, 2)}`);
}

const envVars = parsedEnv.data;

export default {
  appUrl: envVars.APP_URL,
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES
  },
  advanta: {
    apiKey: envVars.ADVANTA_API_KEY,
    partnerId: envVars.ADVANTA_PARTNER_ID,
    apiUrl: envVars.ADVANTA_API_URL,
    shortcode: envVars.ADVANTA_SHORTCODE
  },
  mpesa: {
    shortcode: envVars.MPESA_SHORTCODE,
    consumerKey: envVars.MPESA_CONSUMER_KEY,
    consumerSecret: envVars.MPESA_CONSUMER_SECRET,
    passkey: envVars.MPESA_PASSKEY,
    accessTokenUrl: envVars.MPESA_ACCESS_TOKEN_URL,
    stkPushUrl: envVars.MPESA_STK_PUSH_URL,
    callbackUrl: envVars.MPESA_CALLBACK_URL,
    mpesaVerifyTransaction: envVars.MPESA_VERIFY_TRANSACTION
  }
};
