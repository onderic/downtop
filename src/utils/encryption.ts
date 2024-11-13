import bcrypt from 'bcryptjs';

export const encryptPassword = async (password: string) => {
  const encryptedPassword = await bcrypt.hash(password, 8);
  return encryptedPassword;
};

export const isPasswordMatch = async (password: string, userpassword: string) => {
  return bcrypt.compare(password, userpassword);
};
