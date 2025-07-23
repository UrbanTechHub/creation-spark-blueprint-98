
import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

interface PopupNotificationProps {
  isVisible: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export const PopupNotification = ({ isVisible, message, type, onClose }: PopupNotificationProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className={`${getBgColor()} border rounded-lg shadow-lg p-4 flex items-center space-x-3 max-w-md mx-4 animate-scale-in pointer-events-auto`}>
        {getIcon()}
        <span className="text-gray-800 font-medium">{message}</span>
      </div>
    </div>
  );
};
