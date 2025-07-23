
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface Transaction {
  id: number;
  type: string;
  description: string;
  amount: number;
  date: string;
  status: string;
}

interface TransactionDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export const TransactionDetailDialog = ({ isOpen, onClose, transaction }: TransactionDetailDialogProps) => {
  if (!transaction) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {transaction.amount > 0 ? (
                  <ArrowDownLeft className="w-5 h-5 text-green-600" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900">{transaction.description}</div>
                <div className="text-sm text-gray-500">
                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-xl font-bold ${
                transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                {transaction.status}
              </Badge>
            </div>
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Transaction ID</span>
              <span className="font-mono text-sm">#{transaction.id.toString().padStart(8, '0')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date & Time</span>
              <span>{formatDate(transaction.date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Account</span>
              <span>PREMIER PLUS CKG (...5944)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                {transaction.status}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
