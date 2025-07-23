
import { ChaseLogo } from './ChaseLogo';
import { SocialFooter } from './SocialFooter';
import { Button } from '@/components/ui/button';

interface LogoutPageProps {
  onBackToLogin: () => void;
}

export const LogoutPage = ({ onBackToLogin }: LogoutPageProps) => {
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

        {/* Main logout message */}
        <div className="flex-1 flex items-center justify-center px-4 pb-20">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-xl p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Logged Out for Security</h2>
                <div className="space-y-2 text-gray-600">
                  <p>Suspicious activity detected from a different location.</p>
                  <p>Your account is temporarily locked.</p>
                  <p className="font-medium">Visit the nearest branch with a valid ID to unlock.</p>
                </div>
              </div>

              <Button
                onClick={onBackToLogin}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded-md"
              >
                Sign in again
              </Button>

              <div className="mt-6 text-sm text-gray-500">
                <p>Thank you for banking with Chase</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <SocialFooter />
      </div>
    </div>
  );
};
