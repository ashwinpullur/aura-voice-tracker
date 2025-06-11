
import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface OTPInputProps {
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  isLoading?: boolean;
}

const OTPInput = ({ onVerify, onResend, isLoading = false }: OTPInputProps) => {
  const [otp, setOtp] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const { toast } = useToast();

  const handleComplete = async (value: string) => {
    if (value.length === 6) {
      try {
        await onVerify(value);
      } catch (error) {
        toast({
          title: "Invalid OTP",
          description: "Please check your code and try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await onResend();
      toast({
        title: "OTP Sent",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error) {
      toast({
        title: "Failed to send OTP",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Enter Verification Code</h3>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code sent to your email
        </p>
      </div>
      
      <div className="flex justify-center">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={setOtp}
          onComplete={handleComplete}
          disabled={isLoading}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={handleResend}
          disabled={resendLoading || isLoading}
          size="sm"
        >
          {resendLoading ? "Sending..." : "Resend Code"}
        </Button>
      </div>
    </div>
  );
};

export default OTPInput;
