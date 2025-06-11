
/**
 * Generates a random 6-digit OTP
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Validates if the provided OTP is in correct format
 */
export const validateOTPFormat = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

/**
 * Generates an alphanumeric OTP of specified length
 */
export const generateAlphanumericOTP = (length: number = 6): string => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Creates an expiration timestamp for OTP (default 10 minutes)
 */
export const createOTPExpiration = (minutes: number = 10): Date => {
  const expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + minutes);
  return expiration;
};

/**
 * Checks if OTP has expired
 */
export const isOTPExpired = (expirationTime: Date): boolean => {
  return new Date() > expirationTime;
};
