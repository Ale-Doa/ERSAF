import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import WeatherCard from '../components/WeatherCard';
import NotificationToast from '../components/NotificationToast';
import { RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchWeather();
      // Aggiorna il meteo ogni 5 minuti
      const interval = setInterval(fetchWeather, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    // Mostra notifica se c'è un'allerta meteo
    if (weather && weather.hasAlert && !showNotification) {
      setNotificationMessage(weather.alertMessage);
      setShowNotification(true);
    }
  }, [weather]);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('/api/weather/current', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setWeather(response.data);
    } catch (err) {
      console.error('Errore nel caricamento del meteo:', err);
      setError('Impossibile caricare i dati meteo. Verifica il luogo di residenza nel tuo profilo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Benvenuto, {user?.nome}!
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                Ecco il meteo attuale per {user?.luogoResidenza}
              </p>
            </div>
            
            <button
              onClick={fetchWeather}
              disabled={loading}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${loading ? 'animate-spin' : ''}`} />
              <span>Aggiorna</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base">
            {error}
          </div>
        )}

        {loading && !weather ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <WeatherCard weather={weather} />
        )}

        {/* Informazioni aggiuntive */}
        <div className="mt-4 sm:mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
              Aggiornamenti Automatici
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              I dati meteo vengono aggiornati automaticamente ogni 5 minuti per garantirti informazioni sempre aggiornate.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
              Notifiche Allerta
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Riceverai notifiche in tempo reale in caso di condizioni meteo pericolose nella tua zona.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
              Dati Affidabili
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Utilizziamo OpenWeatherMap per fornirti previsioni meteo accurate e affidabili.
            </p>
          </div>
        </div>
      </div>

      {/* Notifica Toast */}
      {showNotification && (
        <NotificationToast
          message={notificationMessage}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
