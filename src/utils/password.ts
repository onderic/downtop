import generateTimestamp from './timestamp';

export const generatePassword = (shortcode: string, passkey: string): string => {
  const timestamp = generateTimestamp();
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
  return password;
};
