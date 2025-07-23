import { ArrowLeft, Send, Globe, Zap, Home, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { TransferDialog } from '@/components/TransferDialog';

const Transfer = () => {
  const navigate = useNavigate();
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [transferType, setTransferType] = useState<'domestic' | 'international' | 'wire'>('domestic');
  const [currentBalance] = useState(129000.00);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleTransferClick = (type: 'domestic' | 'international' | 'wire') => {
    setTransferType(type);
    setIsTransferOpen(true);
  };

  const handleTransferComplete = (amount: number) => {
    setIsTransferOpen(false);
    // Navigate back to dashboard after successful transfer
    setTimeout(() => {
      navigate('/dashboard', { 
        state: { 
          transferCompleted: true, 
          transferAmount: amount,
          transferType: transferType 
        } 
      });
    }, 2000); // Give time for success notification to show
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header with Dashboard styling */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBack} 
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-gray-900">Transfer Money</h1>
                <p className="text-xs text-gray-600 hidden sm:block">Choose your transfer type</p>
              </div>
            </div>
            
            {/* Profile icon only */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Account Balance Display */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs sm:text-sm opacity-90">Available Balance</div>
                <div className="text-xl sm:text-2xl font-bold">
                  ${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs sm:text-sm opacity-75 mt-1">PREMIER PLUS CKG (...5944)</div>
              </div>
              <div className="text-right">
                <div className="text-xl sm:text-2xl opacity-20">💳</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile responsive title */}
        <div className="mb-4 sm:hidden">
          <p className="text-sm text-gray-600 text-center">Choose your transfer type</p>
        </div>

        {/* Transfer Options - Reduced mobile size and removed hover zoom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {/* Domestic Transfer */}
          <div 
            className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer group"
            onClick={() => handleTransferClick('domestic')}
          >
            <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Send className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Domestic Transfer</h3>
                <p className="text-gray-600 text-xs mb-2">Transfer to accounts within the United States</p>
                <div className="space-y-1 text-xs text-gray-500">
                  <div>• Same day processing</div>
                  <div>• No international fees</div>
                </div>
              </div>
              <div className="w-full pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-500">Processing time</div>
                <div className="font-semibold text-gray-900 text-xs sm:text-sm">Same day</div>
              </div>
            </div>
          </div>

          {/* International Transfer */}
          <div 
            className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 hover:shadow-md hover:border-green-300 transition-all duration-200 cursor-pointer group"
            onClick={() => handleTransferClick('international')}
          >
            <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">International Transfer</h3>
                <p className="text-gray-600 text-xs mb-2">Send money to international bank accounts</p>
                <div className="space-y-1 text-xs text-gray-500">
                  <div>• 200+ countries</div>
                  <div>• Competitive rates</div>
                </div>
              </div>
              <div className="w-full pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-500">Processing time</div>
                <div className="font-semibold text-gray-900 text-xs sm:text-sm">1-3 business days</div>
              </div>
            </div>
          </div>

          {/* Wire Transfer */}
          <div 
            className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 hover:shadow-md hover:border-purple-300 transition-all duration-200 cursor-pointer group sm:col-span-2 lg:col-span-1"
            onClick={() => handleTransferClick('wire')}
          >
            <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Wire Transfer</h3>
                <p className="text-gray-600 text-xs mb-2">Fast, secure transfer for urgent payments</p>
                <div className="space-y-1 text-xs text-gray-500">
                  <div>• Immediate processing</div>
                  <div>• High security</div>
                </div>
              </div>
              <div className="w-full pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-500">Processing time</div>
                <div className="font-semibold text-gray-900 text-xs sm:text-sm">Within hours</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transfers */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transfers</h3>
          <div className="text-center text-gray-500 py-8 sm:py-12">
            <Send className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-base sm:text-lg font-medium">No recent transfers</p>
            <p className="text-xs sm:text-sm">Your transfer history will appear here</p>
          </div>
        </div>
      </div>

      {/* Transfer Dialog */}
      <TransferDialog 
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        onTransferComplete={handleTransferComplete}
        currentBalance={currentBalance}
        transferType={transferType}
      />
    </div>
  );
};

export default Transfer;
