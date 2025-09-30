import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, BellOff } from 'lucide-react';
import {
  isPushNotificationSupported,
  askUserPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  isPushSubscribed
} from '../utils/pushNotifications';

const PushNotificationToggle = () => {
  const { token } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkSupport();
    checkSubscription();
  }, []);

  const checkSupport = () => {
    setIsSupported(isPushNotificationSupported());
  };

  const checkSubscription = async () => {
    const subscribed = await isPushSubscribed();
    setIsSubscribed(subscribed);
  };

  const handleToggle = async () => {
    if (!isSupported) {
      setMessage('Le notifiche push non sono supportate dal tuo browser');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (isSubscribed) {
        // Disabilita notifiche
        const result = await unsubscribeFromPushNotifications(token);
        if (result.success) {
          setIsSubscribed(false);
          setMessage('Notifiche push disabilitate');
        } else {
          setMessage('Errore nella disabilitazione');
        }
      } else {
        // Abilita notifiche
        const permission = await askUserPermission();
        
        if (!permission.granted) {
          setMessage('Permesso negato. Abilita le notifiche nelle impostazioni del browser.');
          setLoading(false);
          return;
        }

        const result = await subscribeToPushNotifications(token);
        if (result.success) {
          setIsSubscribed(true);
          setMessage('Notifiche push abilitate! Riceverai allerte meteo.');
        } else {
          setMessage('Errore nell\'abilitazione: ' + result.error);
        }
      }
    } catch (error) {
      setMessage('Errore: ' + error.message);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          ⚠️ Le notifiche push non sono supportate dal tuo browser
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {isSubscribed ? (
            <Bell className="h-6 w-6 text-blue-600" />
          ) : (
            <BellOff className="h-6 w-6 text-gray-400" />
          )}
          <div>
            <h3 className="font-semibold text-gray-800">Notifiche Push</h3>
            <p className="text-sm text-gray-600">
              {isSubscribed ? 'Abilitate' : 'Disabilitate'}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggle}
          disabled={loading}
          className={`px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 ${
            isSubscribed
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading ? 'Caricamento...' : isSubscribed ? 'Disabilita' : 'Abilita'}
        </button>
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          message.includes('Errore') || message.includes('negato')
            ? 'bg-red-50 text-red-700'
            : 'bg-green-50 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <p className="mt-4 text-sm text-gray-600">
        {isSubscribed
          ? '✅ Riceverai notifiche push quando vengono rilevate allerte meteo, anche quando l\'app non è aperta.'
          : '📱 Abilita le notifiche push per ricevere allerte meteo anche quando l\'app non è aperta.'}
      </p>
    </div>
  );
};

export default PushNotificationToggle;
