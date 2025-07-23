
import { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessNotificationProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
  autoCloseDelay?: number;
}

export const SuccessNotification = ({ 
  isVisible, 
  message, 
  onClose, 
  autoCloseDelay = 2000 
}: SuccessNotificationProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, autoCloseDelay]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-4 max-w-sm mx-4 animate-in fade-in zoom-in duration-300 pointer-events-auto border border-green-100">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Transfer Successful!</h3>
          <p className="text-gray-600">{message}</p>
        </div>
        <div className="w-full bg-green-100 h-1 rounded-full overflow-hidden">
          <div className="h-full bg-green-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
