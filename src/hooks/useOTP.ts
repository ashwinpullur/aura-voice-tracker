
import { useState } from "react";
import { generateOTP, validateOTPFormat, createOTPExpiration, isOTPExpired } from "@/utils/otpGenerator";

interface OTPData {
  code: string;
  expiresAt: Date;
  attempts: number;
}

export const useOTP = () => {
  const [otpData, setOtpData] = useState<OTPData | null>(null);

  const generateNewOTP = (): string => {
    const code = generateOTP();
    const expiresAt = createOTPExpiration(10); // 10 minutes expiration
    
    setOtpData({
      code,
      expiresAt,
      attempts: 0,
    });

    console.log(`Generated OTP: ${code} (expires at ${expiresAt.toISOString()})`);
    return code;
  };

  const verifyOTP = (inputOTP: string): boolean => {
    if (!otpData) {
      return false;
    }

    if (!validateOTPFormat(inputOTP)) {
      return false;
    }

    if (isOTPExpired(otpData.expiresAt)) {
      setOtpData(null);
      return false;
    }

    if (otpData.attempts >= 3) {
      setOtpData(null);
      return false;
    }

    // Increment attempts
    setOtpData(prev => prev ? { ...prev, attempts: prev.attempts + 1 } : null);

    if (inputOTP === otpData.code) {
      setOtpData(null); // Clear OTP after successful verification
      return true;
    }

    return false;
  };

  const clearOTP = () => {
    setOtpData(null);
  };

  return {
    generateNewOTP,
    verifyOTP,
    clearOTP,
    isOTPActive: !!otpData,
    attemptsRemaining: otpData ? 3 - otpData.attempts : 0,
  };
};
