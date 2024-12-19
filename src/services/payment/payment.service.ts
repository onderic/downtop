import httpStatus from 'http-status';
import prisma from '../../client';
import ApiError from '../../utils/ApiError';
import { MpesaStkRequest } from '../../types/mpesa.types';
import tokenService from '../token.service';
import generateTimestamp from '../../utils/timestamp';
import { generatePassword } from '../../utils/password';
import { convertToInternational } from '../../utils/convertPhone';
import config from '../../config/config';
import axios from 'axios';
import dayjs from 'dayjs';

const lipaNaMpesa = async (mpesaData: MpesaStkRequest): Promise<unknown> => {
  try {
    //**Generate access token**
    const accessToken = await tokenService.generateDarajaTokens(
      config.mpesa.consumerKey,
      config.mpesa.consumerSecret
    );

    const [plan, shop] = await Promise.all([
      prisma.plan.findUnique({
        where: { id: mpesaData.planId }
      }),
      prisma.shop.findUnique({
        where: { id: mpesaData.shopId }
      })
    ]);

    if (!shop || !plan) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Shop or plan not found');
    }

    const phone_number = convertToInternational(mpesaData.phone);
    const data = {
      BusinessShortCode: config.mpesa.shortcode,
      Password: generatePassword(config.mpesa.shortcode, config.mpesa.passkey),
      Timestamp: generateTimestamp(),
      TransactionType: 'CustomerPayBillOnline',
      Amount: plan.price,
      PartyA: phone_number,
      PartyB: config.mpesa.shortcode,
      PhoneNumber: phone_number,
      CallBackURL: `${config.appUrl}/${config.mpesa.callbackUrl}`,
      AccountReference: `${shop.name} at Downtop`,
      TransactionDesc: `Payment for subscription of ${shop.name}`
    };
    const response = await axios.post(config.mpesa.stkPushUrl, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const payment = await prisma.payment.create({
      data: {
        merchantRequestId: response.data.MerchantRequestID,
        checkoutRequestId: response.data.CheckoutRequestID,
        shopId: shop.id,
        planId: plan.id
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
  const callbackMetadataItems: CallbackItem[] = stkCallback.CallbackMetadata?.Item || [];

  return prisma
    .$transaction(async (tx) => {
      const payment = await tx.payment.findFirst({
        where: {
          AND: [{ checkoutRequestId: CheckoutRequestID }, { resultCode: null }]
        }
      });

      if (!payment) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found or invalid');
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
        const phoneNumber = callbackMetadataItems.find(
          (item) => item.Name === 'PhoneNumber'
        )?.Value;

        // Create subscription within transaction
        const subscription = await tx.subscription.create({
          data: {
            shopId: payment.shopId,
            planId: payment.planId,
            price: amount,
            status: 'active',
            endDate: dayjs().add(30, 'day').toDate()
          }
        });

        // Update payment within transaction
        const updatedPayment = await tx.payment.update({
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
        return updatedPayment;
      } else {
        console.error(`Payment failed: ${ResultDesc}, ResultCode: ${ResultCode}`);

        const updatedPayment = await tx.payment.update({
          where: { id: payment.id },
          data: {
            resultCode: ResultCode,
            resultDesc: ResultDesc
          }
        });
        return updatedPayment;
      }
    })
    .catch((error) => {
      console.error('Transaction failed:', error);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to process payment callback');
    });
};

export default {
  lipaNaMpesa,
  processCallback
};
