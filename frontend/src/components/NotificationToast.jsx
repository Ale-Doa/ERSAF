import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const NotificationToast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 10000); // Chiudi dopo 10 secondi

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-red-500 text-white rounded-lg shadow-2xl p-4 max-w-md flex items-start space-x-3">
        <AlertTriangle className="h-6 w-6 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">Allerta Meteo</h3>
          <p className="text-sm">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;
