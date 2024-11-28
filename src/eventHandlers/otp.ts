import tokenService from '../services/token.service';
import { eventEmitter } from '../utils/events';

eventEmitter.on('sendOTP', async ({ phone, otp }) => {
  await tokenService.sendOTP(phone, otp);
});

export default eventEmitter;
