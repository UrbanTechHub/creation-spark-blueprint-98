
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Send, Shield, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TransferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTransferComplete: (amount: number, transferData?: any) => void;
  currentBalance: number;
  transferType?: 'domestic' | 'international' | 'wire';
}

// US Banks list for domestic transfers
const usBanks = [
  'JPMorgan Chase Bank',
  'Bank of America',
  'Wells Fargo Bank',
  'Citibank',
  'U.S. Bank',
  'PNC Bank',
  'Goldman Sachs Bank',
  'Truist Bank',
  'Capital One',
  'TD Bank',
  'Bank of New York Mellon',
  'State Street Corporation',
  'American Express Bank',
  'USAA Bank',
  'Charles Schwab Bank',
  'Ally Bank',
  'Navy Federal Credit Union',
  'KeyBank',
  'Regions Bank',
  'Citizens Bank'
];

export const TransferDialog = ({ 
  isOpen, 
  onClose, 
  onTransferComplete, 
  currentBalance,
  transferType = 'domestic' 
}: TransferDialogProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  
  // Common fields
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  
  // Domestic specific
  const [routingNumber, setRoutingNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  
  // International/Wire specific
  const [swiftCode, setSwiftCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankBranch, setBankBranch] = useState('');
  
  // Security fields
  const [transactionPin, setTransactionPin] = useState('');
  const [imfCode, setImfCode] = useState('');
  const [cotCode, setCotCode] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState(''); // 'initial', 'imf', 'cot', 'complete'
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClose = () => {
    setStep(1);
    setAmount('');
    setFirstName('');
    setMiddleName('');
    setLastName('');
    setEmail('');
    setAccountNumber('');
    setRoutingNumber('');
    setSelectedBank('');
    setSwiftCode('');
    setBankName('');
    setBankBranch('');
    setTransactionPin('');
    setImfCode('');
    setCotCode('');
    setIsProcessing(false);
    setProgress(0);
    setProcessingStep('');
    setShowSuccess(false);
    onClose();
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleLogout = () => {
    // Clear login state
    sessionStorage.removeItem('isLoggedIn');
    // Navigate to logout page with security message
    navigate('/logout', { 
      state: { 
        securityLockout: true,
        title: 'Logged Out for Security',
        message: 'Suspicious activity detected from a different location.\nYour account is temporarily locked.\nVisit the nearest branch with a valid ID to unlock.'
      } 
    });
  };

  const handleTransfer = () => {
    setIsProcessing(true);
    setProgress(0);
    setProcessingStep('initial');
    
    // Phase 1: Load to 40% over 3 seconds
    const phase1Interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 40) {
          clearInterval(phase1Interval);
          setProcessingStep('imf');
          return 40;
        }
        return prev + 4; // 40% in 10 steps over 3 seconds
      });
    }, 300);
  };

  const handleImfSubmit = () => {
    if (imfCode === '230857') {
      setProcessingStep('processing');
      setImfCode('');
      
      // Phase 2: Load from 40% to 78% over 3 seconds
      const phase2Interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 78) {
            clearInterval(phase2Interval);
            setProcessingStep('cot');
            return 78;
          }
          return prev + 3.8; // 38% in 10 steps over 3 seconds
        });
      }, 300);
    }
  };

  const handleCotSubmit = () => {
    if (cotCode === '446834') {
      setProcessingStep('processing');
      setCotCode('');
      
      // Phase 3: Load from 78% to 100% over 2 seconds
      const phase3Interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(phase3Interval);
            setProcessingStep('complete');
            setShowSuccess(true);
            
            // Auto redirect to dashboard after 3 seconds
            setTimeout(() => {
              onTransferComplete(parseFloat(amount));
              navigate('/dashboard');
            }, 3000);
            
            return 100;
          }
          return prev + 2.2; // 22% in 10 steps over 2 seconds
        });
      }, 200);
    }
  };

  // Reset processing state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setIsProcessing(false);
      setProgress(0);
      setProcessingStep('');
      setShowSuccess(false);
    }
  }, [isOpen]);

  const getTransferTypeTitle = () => {
    switch (transferType) {
      case 'international':
        return 'International Transfer';
      case 'wire':
        return 'Wire Transfer';
      default:
        return 'Domestic Transfer';
    }
  };

  const validateStep2 = () => {
    const commonFields = firstName && lastName && email && accountNumber;
    
    if (transferType === 'domestic') {
      return commonFields && routingNumber && selectedBank;
    } else {
      return commonFields && swiftCode && bankName && bankBranch;
    }
  };

  const validateStep3 = () => {
    return transactionPin === '2805';
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step > 1 && !isProcessing && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            {isProcessing ? (
              showSuccess ? 'Transfer Successful!' : 'Processing Transfer...'
            ) : (
              `${getTransferTypeTitle()} - Step ${step} of 4`
            )}
          </DialogTitle>
        </DialogHeader>

        {isProcessing ? (
          <div className="space-y-4 py-6">
            {showSuccess ? (
              <div className="text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <div className="text-lg font-semibold text-green-600">
                  Transfer Successful!
                </div>
                <div className="text-sm text-gray-600">
                  ${parseFloat(amount || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })} has been transferred to {firstName} {lastName}
                </div>
                <div className="text-xs text-gray-500">
                  Redirecting to dashboard...
                </div>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <div className="text-lg font-semibold mb-2">
                    Transferring ${parseFloat(amount || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    To: {firstName} {lastName}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                {processingStep === 'imf' && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="text-center">
                      <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-semibold">Security Verification Required</h4>
                      <p className="text-sm text-gray-600">Enter IMF Code to continue</p>
                    </div>
                    <div>
                      <Label htmlFor="imfCodeProcessing" className="text-sm">IMF Code</Label>
                      <Input
                        id="imfCodeProcessing"
                        placeholder="Enter IMF Code"
                        value={imfCode}
                        onChange={(e) => setImfCode(e.target.value)}
                        className="h-8 sm:h-10"
                      />
                      {imfCode && imfCode !== '230857' && (
                        <p className="text-xs text-red-500 mt-1">Invalid IMF Code.</p>
                      )}
                    </div>
                    <Button 
                      onClick={handleImfSubmit}
                      className="w-full"
                      disabled={imfCode !== '230857'}
                    >
                      Continue Transfer
                    </Button>
                  </div>
                )}
                
                {processingStep === 'cot' && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="text-center">
                      <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-semibold">Final Security Check</h4>
                      <p className="text-sm text-gray-600">Enter COT Code to complete transfer</p>
                    </div>
                    <div>
                      <Label htmlFor="cotCodeProcessing" className="text-sm">COT Code</Label>
                      <Input
                        id="cotCodeProcessing"
                        placeholder="Enter COT Code"
                        value={cotCode}
                        onChange={(e) => setCotCode(e.target.value)}
                        className="h-8 sm:h-10"
                      />
                      {cotCode && cotCode !== '446834' && (
                        <p className="text-xs text-red-500 mt-1">Invalid COT Code.</p>
                      )}
                    </div>
                    <Button 
                      onClick={handleCotSubmit}
                      className="w-full"
                      disabled={cotCode !== '446834'}
                    >
                      Complete Transfer
                    </Button>
                  </div>
                )}
                
                {processingStep === 'initial' && (
                  <div className="text-center text-sm text-gray-500">
                    Please wait while we initiate your transfer...
                  </div>
                )}
                
                {processingStep === 'processing' && (
                  <div className="text-center text-sm text-gray-500">
                    Processing transfer...
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <>
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount" className="text-sm">Transfer Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-base sm:text-lg h-8 sm:h-10"
                  />
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Available: ${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <Button 
                  onClick={handleNext} 
                  className="w-full h-9 sm:h-10"
                  disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > currentBalance}
                >
                  Continue
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-8 sm:h-10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="middleName" className="text-sm">Middle Name</Label>
                    <Input
                      id="middleName"
                      placeholder="M"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      className="h-8 sm:h-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="lastName" className="text-sm">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-8 sm:h-10"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-8 sm:h-10"
                  />
                </div>

                <div>
                  <Label htmlFor="accountNumber" className="text-sm">Account Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="1234567890"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="h-8 sm:h-10"
                  />
                </div>

                {transferType === 'domestic' ? (
                  <>
                    <div>
                      <Label htmlFor="routingNumber" className="text-sm">Routing Number</Label>
                      <Input
                        id="routingNumber"
                        placeholder="021000021"
                        value={routingNumber}
                        onChange={(e) => setRoutingNumber(e.target.value)}
                        className="h-8 sm:h-10"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bank" className="text-sm">Bank</Label>
                      <Select value={selectedBank} onValueChange={setSelectedBank}>
                        <SelectTrigger className="h-8 sm:h-10">
                          <SelectValue placeholder="Select a bank" />
                        </SelectTrigger>
                        <SelectContent>
                          {usBanks.map((bank) => (
                            <SelectItem key={bank} value={bank}>
                              {bank}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="swiftCode" className="text-sm">SWIFT Code</Label>
                      <Input
                        id="swiftCode"
                        placeholder="CHASUS33"
                        value={swiftCode}
                        onChange={(e) => setSwiftCode(e.target.value)}
                        className="h-8 sm:h-10"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bankName" className="text-sm">Bank Name</Label>
                      <Input
                        id="bankName"
                        placeholder="Chase Bank"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="h-8 sm:h-10"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bankBranch" className="text-sm">Bank Branch</Label>
                      <Input
                        id="bankBranch"
                        placeholder="New York Main Branch"
                        value={bankBranch}
                        onChange={(e) => setBankBranch(e.target.value)}
                        className="h-8 sm:h-10"
                      />
                    </div>
                  </>
                )}

                <Button 
                  onClick={handleNext} 
                  className="w-full h-9 sm:h-10"
                  disabled={!validateStep2()}
                >
                  Continue
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <Shield className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-lg">Security Verification</h3>
                  <p className="text-sm text-gray-600">Enter your 4-digit transaction PIN</p>
                </div>

                <div>
                  <Label htmlFor="transactionPin" className="text-sm">Transaction PIN</Label>
                  <Input
                    id="transactionPin"
                    type="password"
                    placeholder="••••"
                    value={transactionPin}
                    onChange={(e) => setTransactionPin(e.target.value)}
                    className="h-8 sm:h-10 text-center text-lg"
                    maxLength={4}
                  />
                  {transactionPin && !validateStep3() && (
                    <p className="text-xs text-red-500 mt-1">Invalid PIN. Please try again.</p>
                  )}
                </div>

                <Button 
                  onClick={handleNext} 
                  className="w-full h-9 sm:h-10"
                  disabled={!validateStep3()}
                >
                  Verify PIN
                </Button>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2">
                  <h3 className="font-semibold text-sm sm:text-base">Transfer Summary</h3>
                  <div className="text-xs sm:text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-medium">${parseFloat(amount || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>To:</span>
                      <span>{firstName} {middleName && middleName + ' '}{lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span>{email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Account:</span>
                      <span>***{accountNumber.slice(-4)}</span>
                    </div>
                    {transferType === 'domestic' ? (
                      <>
                        <div className="flex justify-between">
                          <span>Routing:</span>
                          <span>{routingNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bank:</span>
                          <span>{selectedBank}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span>SWIFT:</span>
                          <span>{swiftCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bank:</span>
                          <span>{bankName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Branch:</span>
                          <span>{bankBranch}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="capitalize">{transferType}</span>
                    </div>
                  </div>
                </div>

                <Button onClick={handleTransfer} className="w-full h-9 sm:h-10">
                  <Send className="w-4 h-4 mr-2" />
                  Complete Transfer
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
