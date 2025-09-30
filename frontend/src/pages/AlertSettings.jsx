import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PushNotificationToggle from '../components/PushNotificationToggle';
import { Settings, Save, RotateCcw, Thermometer, Wind, Cloud } from 'lucide-react';

const AlertSettings = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  
  const [preferences, setPreferences] = useState({
    temperatureMin: 0,
    temperatureMax: 35,
    windSpeed: 50,
    enableThunderstorm: true,
    enableSnow: true,
    enableFog: true
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users/alert-preferences', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPreferences(response.data);
    } catch (err) {
      console.error('Errore nel caricamento delle preferenze:', err);
      setError('Impossibile caricare le preferenze');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await axios.put('/api/users/alert-preferences', preferences, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('Preferenze salvate con successo!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Errore nel salvataggio');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    setPreferences({
      temperatureMin: 0,
      temperatureMax: 35,
      windSpeed: 50,
      enableThunderstorm: true,
      enableSnow: true,
      enableFog: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Settings className="h-8 w-8 mr-3" />
            Impostazioni Allerte Meteo
          </h1>
          <p className="text-gray-600 mt-2">
            Personalizza quando ricevere le notifiche meteo
          </p>
        </div>

        {/* Notifiche Push */}
        <PushNotificationToggle />

        <form onSubmit={handleSubmit} className="space-y-6">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Soglie Temperatura */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Thermometer className="h-6 w-6 mr-2 text-blue-600" />
              Soglie Temperatura
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperatura Minima (°C)
                </label>
                <input
                  type="number"
                  value={preferences.temperatureMin}
                  onChange={(e) => handleChange('temperatureMin', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="-50"
                  max="50"
                  step="1"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Ricevi allerta se la temperatura scende sotto questo valore
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperatura Massima (°C)
                </label>
                <input
                  type="number"
                  value={preferences.temperatureMax}
                  onChange={(e) => handleChange('temperatureMax', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="-50"
                  max="60"
                  step="1"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Ricevi allerta se la temperatura supera questo valore
                </p>
              </div>
            </div>
          </div>

          {/* Soglia Vento */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Wind className="h-6 w-6 mr-2 text-cyan-600" />
              Soglia Vento
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Velocità Vento (km/h)
              </label>
              <input
                type="number"
                value={preferences.windSpeed}
                onChange={(e) => handleChange('windSpeed', parseFloat(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="200"
                step="5"
              />
              <p className="mt-1 text-sm text-gray-500">
                Ricevi allerta se il vento supera questo valore
              </p>
            </div>
          </div>

          {/* Condizioni Meteo */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Cloud className="h-6 w-6 mr-2 text-indigo-600" />
              Condizioni Meteo
            </h2>
            
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.enableThunderstorm}
                  onChange={(e) => handleChange('enableThunderstorm', e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">
                  ⛈️ Allerta per Temporali
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.enableSnow}
                  onChange={(e) => handleChange('enableSnow', e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">
                  🌨️ Allerta per Neve
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.enableFog}
                  onChange={(e) => handleChange('enableFog', e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">
                  🌫️ Allerta per Nebbia
                </span>
              </label>
            </div>
          </div>

          {/* Pulsanti */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              <span>{saving ? 'Salvataggio...' : 'Salva Preferenze'}</span>
            </button>

            <button
              type="button"
              onClick={resetToDefaults}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Ripristina Default</span>
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Come funziona</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Le allerte vengono generate automaticamente quando le condizioni meteo superano le tue soglie</li>
            <li>• Riceverai una notifica in-app quando viene rilevata un'allerta</li>
            <li>• Puoi disabilitare specifiche condizioni meteo deselezionando le checkbox</li>
            <li>• Le modifiche si applicano immediatamente al prossimo controllo meteo</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AlertSettings;
