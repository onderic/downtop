import crypto from 'crypto';
import config from '../config/config';

const generateSecurityCredentials = (): string => {
  const password = '';
  const publicKey = config.mpesa.publicKey || '';
  const encryptedPassword = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    },
    Buffer.from(password)
  );
  const securityCredential = encryptedPassword.toString('base64');
  console.log('Generated SecurityCredential:', securityCredential);
  return securityCredential;
};

export default generateSecurityCredentials;
