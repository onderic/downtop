export const convertToInternational = (phoneNumber: string): string => {
  // Replace the starting 0 with +254
  const internationalNumber = phoneNumber.replace(/^0/, '254');

  return internationalNumber;
};
