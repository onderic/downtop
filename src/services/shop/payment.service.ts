import { Payment } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../client';
import ApiError from '../../utils/ApiError';
import { Mpesa } from '../../types/mpesa.types';
import tokenService from '../token.service';
import generateTimestamp from '../../utils/timestamp';
import { generatePassword } from '../../utils/password';
import config from '../../config/config';
import axios from 'axios';

const lipaNaMpesa = async (mpesaData: Mpesa): Promise<Payment> => {
  try {
    //**Generate access token**
    const accessToken = await tokenService.generateDarajaTokens(
      config.mpesa.consumerKey,
      config.mpesa.consumerSecret
    );

    const shop = await prisma.shop.findUnique({
      where: { id: mpesaData.shopId }
    });

    const data = {
      BusinessShortCode: config.mpesa.shortcode,
      Password: generatePassword(config.mpesa.shortcode, config.mpesa.passkey),
      Timestamp: generateTimestamp(),
      TransactionType: 'CustomerPayBillOnline',
      // Amount: mpesaData.amount,
      PartyA: mpesaData.phone,
      PartyB: config.mpesa.shortcode,
      PhoneNumber: mpesaData.phone,
      CallBackURL: config.mpesa,
      AccountReference: shop?.name,
      TransactionDesc: `Payment for subscription of ${shop?.name}`
    };

    const response = await axios.post(config.mpesa.stkPushUrl, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const payment = await prisma.payment.create({
      data: {
        subscriptionId: 'qq1',
        merchantRequestId: response.data.MpesaReceiptNumber,
        checkoutRequestId: response.data.CheckoutRequestID
      }
    });

    return payment;
  } catch (error: any) {
    console.error('Error initiating payment:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Payment initiation failed');
  }
};

export default {
  lipaNaMpesa
};
