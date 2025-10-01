import React, { useState } from 'react';
import { Cloud, Droplets, Wind, Gauge, AlertTriangle, Clock } from 'lucide-react';
import TemperatureChart from './TemperatureChart';

const WeatherCard = ({ weather }) => {
  if (!weather) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-gray-500">Caricamento dati meteo...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-xl p-8 text-white">
      {/* Allerta Meteo */}
      {weather.hasAlert && (
        <div className="mb-6 bg-red-500 bg-opacity-90 rounded-lg p-4 flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-lg mb-1">Allerta Meteo</h3>
            <p className="text-sm">{weather.alertMessage}</p>
          </div>
        </div>
      )}

      {/* Città e Temperatura */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">
          {weather.city}, {weather.country}
        </h2>
        <div className="flex items-center justify-center space-x-4">
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
            alt={weather.description}
            className="w-32 h-32"
          />
          <div>
            <div className="text-6xl font-bold">{weather.temperature}°C</div>
            <p className="text-xl capitalize mt-2">{weather.description}</p>
          </div>
        </div>
      </div>

      {/* Dettagli Meteo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
          <div className="flex justify-center mb-2">
            <Gauge className="h-6 w-6" />
          </div>
          <p className="text-sm opacity-90">Percepitazioni</p>
          <p className="text-2xl font-bold">{weather.feelsLike}°C</p>
        </div>

        <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
          <div className="flex justify-center mb-2">
            <Droplets className="h-6 w-6" />
          </div>
          <p className="text-sm opacity-90">Umidità</p>
          <p className="text-2xl font-bold">{weather.humidity}%</p>
        </div>

        <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
          <div className="flex justify-center mb-2">
            <Wind className="h-6 w-6" />
          </div>
          <p className="text-sm opacity-90">Vento</p>
          <p className="text-2xl font-bold">{weather.windSpeed} m/s</p>
        </div>

        <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
          <div className="flex justify-center mb-2">
            <Cloud className="h-6 w-6" />
          </div>
          <p className="text-sm opacity-90">Nuvolosità</p>
          <p className="text-2xl font-bold">{weather.clouds}%</p>
        </div>
      </div>

      {/* Grafico Temperatura */}
      {weather.hourlyForecast && weather.hourlyForecast.length > 0 && (
        <TemperatureChart hourlyForecast={weather.hourlyForecast} />
      )}

      {/* Timestamp */}
      <div className="mt-6 text-center text-sm opacity-75">
        Ultimo aggiornamento: {new Date(weather.timestamp).toLocaleString('it-IT')}
      </div>
    </div>
  );
};

export default WeatherCard;
