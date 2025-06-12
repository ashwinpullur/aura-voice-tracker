
import { supabase } from "@/integrations/supabase/client";

export const useEmailOTP = () => {
  const sendOTPEmail = async (email: string, otp: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('send-otp-email', {
        body: { email, otp }
      });

      if (error) {
        console.error('Error sending OTP email:', error);
        return false;
      }

      console.log('OTP email sent successfully:', data);
      return true;
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      return false;
    }
  };

  return { sendOTPEmail };
};
