
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, Mail, Phone, Shield, TrendingUp } from 'lucide-react';

interface ProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDialog = ({ isOpen, onClose }: ProfileDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Information
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Personal Information</h3>
            
            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Account Holder</div>
                  <div className="font-medium text-gray-900">Chery Hall</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Email Address</div>
                  <div className="font-medium text-gray-900">Baileyrobert707@gmail.com</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Phone Number</div>
                  <div className="font-medium text-gray-900">+17175749366</div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Information */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Security</h3>
            
            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Transaction PIN</div>
                  <div className="font-medium text-gray-900">••••</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Credit Score</div>
                  <div className="font-medium text-green-600">700</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
