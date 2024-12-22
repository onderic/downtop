import crypto from 'crypto';

const generateSecurityCredentials = (): string => {
  const password = 'Safaricom999!*!';
  const publicKey = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqLcFdVcV7HdEOotsNLoM
PhD74CX1ejzcgfNuiJNy9pTySxbszRBCWxmok3Unul4rX/zyVD/6vDb9nbqRywZI
gR46UOn+tR3vGXXPX6igxgS6DYTaQV8W858yOGLuoYwRi5xeQJfczAMU4o+sCxlB
bMCqYs4nzW81fi8iF2OEUdrfJcbamhSnksdgfD/nomWy9MESAz1QufrOBnaRX2N0
CKsi8SNmzsghpfP15VLiIVV8YXPFKtd9sY37FpY28OKGjKG5wdije/bzFL8qEcPD
hqYGuVaGkhX1bkI0iH+UcFtYYrZv/Fyb5jRHXmNLiq4mMG0fMH8ENxNACFtRZTDI
IQIDAQAB
-----END PUBLIC KEY-----
`;

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
