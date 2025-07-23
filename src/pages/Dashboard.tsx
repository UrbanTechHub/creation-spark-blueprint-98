
import { Plus, MoreHorizontal, ChevronRight, CreditCard, Building2, PiggyBank, Home, Briefcase, HelpCircle, User, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TransferDialog } from '@/components/TransferDialog';
import { TransactionDetailDialog } from '@/components/TransactionDetailDialog';
import { ProfileDialog } from '@/components/ProfileDialog';

export const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(129000.00); // Updated Premier Checking balance

  // Updated transaction history to match the provided data
  const [transactions, setTransactions] = useState([
    {
      id: 13,
      type: 'credit',
      description: 'Consultancy Payment',
      amount: 8000.00,
      date: '2025-04-15',
      status: 'completed',
      balance: 120000.00
    },
    {
      id: 12,
      type: 'debit',
      description: 'House Maintenance',
      amount: -2500.00,
      date: '2025-04-10',
      status: 'completed',
      balance: 112000.00
    },
    {
      id: 11,
      type: 'credit',
      description: 'Salary',
      amount: 30000.00,
      date: '2025-04-01',
      status: 'completed',
      balance: 114500.00
    },
    {
      id: 10,
      type: 'credit',
      description: 'Bonus',
      amount: 12000.00,
      date: '2025-03-25',
      status: 'completed',
      balance: 84500.00
    },
    {
      id: 9,
      type: 'debit',
      description: 'Car Purchase Down Payment',
      amount: -10000.00,
      date: '2025-03-12',
      status: 'completed',
      balance: 72500.00
    }
  ]);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isTransactionDetailOpen, setIsTransactionDetailOpen] = useState(false);

  // Check if we came from a completed transfer and update accordingly
  useEffect(() => {
    if (location.state?.transferCompleted && location.state?.transferAmount) {
      const transferAmount = location.state.transferAmount;
      const transferType = location.state.transferType || 'domestic';
      
      // Update balance
      const newBalance = currentBalance - transferAmount;
      setCurrentBalance(newBalance);
      
      // Add new transaction to history
      const newTransaction = {
        id: Date.now(), // Simple ID generation
        type: 'transfer',
        description: `${transferType.charAt(0).toUpperCase() + transferType.slice(1)} Transfer`,
        amount: -transferAmount,
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        balance: newBalance
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Clear the state to prevent re-processing
      window.history.replaceState({}, document.title);
    }
  }, [location.state, currentBalance]);

  // Get current date and format it
  const getCurrentDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return today.toLocaleDateString('en-US', options);
  };

  const handleTransferClick = () => {
    navigate('/transfer');
  };

  const handlePayBillClick = () => {
    navigate('/transactions');
  };

  const handleTransferComplete = (amount: number, transferData?: any) => {
    // Update balance
    const newBalance = currentBalance - amount;
    setCurrentBalance(newBalance);
    
    // Add new transaction to history
    if (transferData) {
      const newTransaction = {
        id: Date.now(),
        type: 'transfer',
        description: `${transferData.transferType.charAt(0).toUpperCase() + transferData.transferType.slice(1)} Transfer to ${transferData.firstName} ${transferData.lastName}`,
        amount: -amount,
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        balance: newBalance
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
    }
    
    setIsTransferOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleTransactionClick = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsTransactionDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50/95 pb-20 relative">
      {/* Header */}
      <div className="bg-white/95 px-4 py-6 border-b backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-white transform rotate-45 relative">
              <div className="absolute inset-1 bg-blue-600 transform -rotate-45"></div>
            </div>
          </div>
          <button 
            className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
            onClick={() => setIsProfileOpen(true)}
          >
            <User className="w-5 h-5 text-blue-600" />
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Good morning Chery!</h1>
          <p className="text-gray-600 mt-1">{getCurrentDate()}</p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center justify-between mt-6">
          <button className="flex items-center text-blue-600">
            <Plus className="w-5 h-5 mr-2" />
          </button>
          <div className="flex space-x-8">
            <button className="text-center">
              <div className="text-blue-600 text-sm">Deposit checks</div>
            </button>
            <button 
              className="text-center"
              onClick={handleTransferClick}
            >
              <div className="text-blue-600 text-sm">Transfer</div>
            </button>
            <button 
              className="text-center"
              onClick={handlePayBillClick}
            >
              <div className="text-blue-600 text-sm">See bill activity</div>
            </button>
          </div>
        </div>
      </div>

      {/* Accounts Section */}
      <div className="px-4 py-4 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Accounts</h2>
          <button>
            <MoreHorizontal className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Bank accounts */}
        <div className="bg-blue-600 rounded-t-lg px-4 py-3">
          <div className="text-white font-medium">Bank accounts (1)</div>
        </div>
        
        <div className="bg-white border-l border-r border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-gray-600">PREMIER PLUS CKG (...5944)</span>
              <ChevronRight className="w-4 h-4 text-gray-400 ml-2" />
            </div>
          </div>
          <div className="mt-2 text-right">
            <div className="text-2xl font-bold text-gray-900">${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="text-sm text-gray-600">Available balance</div>
          </div>
        </div>

        {/* Credit cards */}
        <div className="bg-blue-600 px-4 py-3 mt-4">
          <div className="text-white font-medium flex items-center">
            <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            Credit cards (2)
          </div>
        </div>
        
        <div className="bg-white border-l border-r border-gray-200 px-4 py-4 rounded-b-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-gray-600">Freedom (...0461)</span>
              <ChevronRight className="w-4 h-4 text-gray-400 ml-2" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="w-16 h-10 rounded overflow-hidden">
              <img 
                src="/lovable-uploads/b0c92ffc-dd92-419d-ac47-26007fd2a8cf.png" 
                alt="Freedom Unlimited Card" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">$20,000.00</div>
              <div className="text-sm text-gray-600">Current balance</div>
            </div>
          </div>
          <div className="mt-4 flex items-center text-red-600 text-sm">
            <div className="w-4 h-4 bg-red-600 rounded-full mr-2 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            Thank you for visiting our website.
          </div>
        </div>

        {/* Loans & lines of credit */}
        <div className="bg-blue-600 px-4 py-3 mt-4">
          <div className="text-white font-medium">Loans & lines of credit (1)</div>
        </div>
        
        <div className="bg-white border-l border-r border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-gray-600">MORTGAGE LOAN (...7799)</span>
              <ChevronRight className="w-4 h-4 text-gray-400 ml-2" />
            </div>
          </div>
          <div className="mt-2 text-right">
            <div className="text-2xl font-bold text-gray-900">$0.00</div>
            <div className="text-sm text-gray-600">Principal balance</div>
          </div>
        </div>

        {/* Link external accounts */}
        <div className="mt-6">
          <button className="flex items-center justify-between w-full text-left">
            <span className="text-gray-900 font-medium">Link external accounts</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="px-4 py-6 bg-white/95 mt-4 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
          <button 
            className="text-blue-600 text-sm font-medium"
            onClick={() => navigate('/transactions')}
          >
            View All
          </button>
        </div>
        
        <div className="space-y-3">
          {transactions.slice(0, 5).map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handleTransactionClick(transaction)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.amount > 0 ? (
                    <ArrowDownLeft className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{transaction.description}</div>
                  <div className="text-xs text-gray-500">{formatDate(transaction.date)}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-semibold ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-gray-500 capitalize">{transaction.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Open an account section */}
      <div className="px-4 py-6 bg-white/95 mt-4 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Open an account</h2>
        
        <div className="grid grid-cols-5 gap-4 mb-4">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <CreditCard className="w-8 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-700">Credit cards</span>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <Building2 className="w-8 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-700">Checking</span>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <PiggyBank className="w-8 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-700">Savings & CDs</span>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <Home className="w-8 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-700">Mortgage</span>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <Briefcase className="w-8 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-700">Business</span>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button className="px-6 py-2 border border-gray-300 rounded-full text-gray-600 text-sm">
            Explore products
          </button>
        </div>
      </div>

      {/* Ultimate Rewards section */}
      <div className="px-4 py-6 bg-white/95 mt-4 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Ultimate Rewards®</h2>
          <ChevronRight className="w-6 h-6 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <div className="text-4xl font-bold text-gray-900 mb-1">0</div>
            <div className="text-gray-600">Available points</div>
          </div>
          
          <div>
            <div className="text-4xl font-bold text-gray-900 mb-1">0</div>
            <div className="text-gray-600">Pending points</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <HelpCircle className="w-6 h-6 text-gray-400" />
          <button className="px-6 py-2 border border-gray-300 rounded-full text-gray-600 text-sm">
            Book travel
          </button>
        </div>
      </div>

      {/* Chase Offers section */}
      <div className="px-4 py-6 bg-white/95 mt-4 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Chase Offers</h2>
          <div className="flex items-center">
            <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full mr-2">112</div>
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">Add deals, shop and get cash back</p>
        <p className="text-gray-500 text-sm mb-6">For PREMIER PLUS CKG (...5944)</p>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="relative">
            <div className="w-full h-24 bg-gradient-to-r from-pink-200 to-blue-200 rounded-lg relative overflow-hidden">
              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                New
              </div>
              <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-xs font-semibold">
                ULTA
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">Ulta Beauty</p>
          </div>
          
          <div className="relative">
            <div className="w-full h-24 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg relative overflow-hidden flex items-center justify-center">
              <div className="text-white text-2xl">🚲</div>
            </div>
            <p className="text-xs text-gray-600 mt-2">Rad Power Bikes</p>
          </div>
          
          <div className="relative">
            <div className="w-full h-24 bg-gray-100 rounded-lg relative overflow-hidden flex items-center justify-center">
              <div className="text-black text-xl font-bold">ACE</div>
            </div>
            <p className="text-xs text-gray-600 mt-2">Ace Hardware</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 border-t border-gray-200 backdrop-blur-sm">
        <div className="flex justify-around py-2">
          <button className="flex flex-col items-center py-2 text-blue-600">
            <div className="w-6 h-6 bg-blue-600 rounded mb-1"></div>
            <span className="text-xs">Accounts</span>
          </button>
          <button 
            className="flex flex-col items-center py-2 text-gray-500"
            onClick={handleTransferClick}
          >
            <div className="w-6 h-6 border-2 border-gray-300 rounded-full mb-1 flex items-center justify-center">
              <span className="text-xs">$</span>
            </div>
            <span className="text-xs">Pay & transfer</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-500">
            <div className="w-6 h-6 border-2 border-gray-300 rounded mb-1"></div>
            <span className="text-xs">Plan & track</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-500">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="text-xs">Benefits & travel</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-500">
            <div className="flex flex-col space-y-1 mb-1">
              <div className="w-4 h-0.5 bg-gray-400"></div>
              <div className="w-4 h-0.5 bg-gray-400"></div>
              <div className="w-4 h-0.5 bg-gray-400"></div>
            </div>
            <span className="text-xs">More</span>
          </button>
        </div>
        <div className="h-1 bg-black mx-auto w-32 rounded-full mb-2"></div>
      </div>

      {/* Transfer Dialog */}
      <TransferDialog 
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        onTransferComplete={handleTransferComplete}
        currentBalance={currentBalance}
      />

      {/* Transaction Detail Dialog */}
      <TransactionDetailDialog
        isOpen={isTransactionDetailOpen}
        onClose={() => setIsTransactionDetailOpen(false)}
        transaction={selectedTransaction}
      />

      {/* Profile Dialog */}
      <ProfileDialog
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
};
