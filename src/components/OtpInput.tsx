
import { useState } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface OtpInputProps {
  onBack: () => void;
  onVerify: (otp: string) => void;
}

export const OtpInput = ({ onBack, onVerify }: OtpInputProps) => {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      onVerify(otp);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8">
      <div className="mb-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Enter verification code</h2>
        <p className="text-gray-600">We've sent a 6-digit code to your mobile number ending in ****</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
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

        <Button
          type="submit"
          disabled={otp.length !== 6}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-base font-medium rounded-md"
        >
          Verify
        </Button>

        <div className="text-center">
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800 text-base"
          >
            Didn't receive the code? Resend
          </button>
        </div>
      </form>
    </div>
  );
};
