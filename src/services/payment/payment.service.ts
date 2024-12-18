import httpStatus from 'http-status';
import prisma from '../../client';
import ApiError from '../../utils/ApiError';
import { Mpesa } from '../../types/mpesa.types';
import tokenService from '../token.service';
import generateTimestamp from '../../utils/timestamp';
import { generatePassword } from '../../utils/password';
import { convertToInternational } from '../../utils/convertPhone';
import config from '../../config/config';
import axios from 'axios';
import dayjs from 'dayjs';

const lipaNaMpesa = async (mpesaData: Mpesa): Promise<unknown> => {
  try {
    //**Generate access token**
    const accessToken = await tokenService.generateDarajaTokens(
      config.mpesa.consumerKey,
      config.mpesa.consumerSecret
    );

    const shop = await prisma.shop.findUnique({
      where: { id: mpesaData.shopId }
    });

    if (!shop) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Shop not found');
    }

    const phone_number = convertToInternational(mpesaData.phone);
    console.log('phone', phone_number);
    const data = {
      BusinessShortCode: config.mpesa.shortcode,
      Password: generatePassword(config.mpesa.shortcode, config.mpesa.passkey),
      Timestamp: generateTimestamp(),
      TransactionType: 'CustomerPayBillOnline',
      Amount: 1,
      PartyA: phone_number,
      PartyB: config.mpesa.shortcode,
      PhoneNumber: phone_number,
      CallBackURL: 'https://20e8-41-89-162-2.ngrok-free.app/v1/payments/callback/',
      AccountReference: shop.name,
      TransactionDesc: `Payment for subscription of ${shop.name}`
    };

    const response = await axios.post(config.mpesa.stkPushUrl, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // return payment;
        'Content-Type': 'application/json'
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const payment = await prisma.payment.create({
      data: {
        merchantRequestId: response.data.MerchantRequestID,
        checkoutRequestId: response.data.CheckoutRequestID,
        shopId: shop.id
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error initiating payment:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Payment initiation failed');
  }
};

interface CallbackItem {
  Name: string;
  Value: any;
}

const processCallback = async (callbackData: any) => {
  const { Body } = callbackData;
  console.log(Body);
  const { stkCallback } = Body;

  const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

  // Extract callback metadata items
  const callbackMetadataItems: CallbackItem[] = stkCallback.CallbackMetadata?.Item || [];

  const payment = await prisma.payment.findFirst({
    where: { checkoutRequestId: CheckoutRequestID }
  });

  if (!payment) {
    console.error(`No payment found for CheckoutRequestID: ${CheckoutRequestID}`);
    return;
  }

  if (ResultCode === 0) {
    // Success case
    const amount = callbackMetadataItems.find((item) => item.Name === 'Amount')?.Value;
    const mpesaReceiptNumber = callbackMetadataItems.find(
      (item) => item.Name === 'MpesaReceiptNumber'
    )?.Value;
    const transactionDate = callbackMetadataItems.find(
      (item) => item.Name === 'TransactionDate'
    )?.Value;
    const phoneNumber = callbackMetadataItems.find((item) => item.Name === 'PhoneNumber')?.Value;

    // **Create a subscription**
    const subscription = await prisma.subscription.create({
      data: {
        shopId: payment.shopId,
        planId: 'Monthly',
        price: amount,
        status: 'active',
        endDate: dayjs().add(30, 'day').toDate()
      }
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        subscriptionId: subscription.id,
        merchantRequestId: MerchantRequestID,
        checkoutRequestId: CheckoutRequestID,
        resultCode: ResultCode,
        resultDesc: ResultDesc,
        amount: amount,
        receiptNumber: mpesaReceiptNumber,
        transactionDate: transactionDate.toString(),
        phoneNumber: phoneNumber.toString()
      }
    });

    console.log(
      `Payment successful: ${ResultDesc}, Amount: ${amount}, Receipt: ${mpesaReceiptNumber}`
    );
  } else {
    console.error(`Payment failed: ${ResultDesc}, ResultCode: ${ResultCode}`);

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        resultCode: ResultCode,
        resultDesc: ResultDesc
      }
    });
  }
};

export default {
  lipaNaMpesa,
  processCallback
};
