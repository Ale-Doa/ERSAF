import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Wind, Droplets } from 'lucide-react';

const TemperatureChart = ({ hourlyForecast }) => {
  if (!hourlyForecast || hourlyForecast.length === 0) {
    return null;
  }

  // Prepara i dati per il grafico
  const chartData = hourlyForecast.map((forecast, index) => ({
    time: forecast.time,
    temperatura: forecast.temperature,
    tempMin: forecast.tempMin,
    tempMax: forecast.tempMax,
    umidità: forecast.humidity,
    vento: Math.round(forecast.windSpeed * 3.6),
    descrizione: forecast.description,
    index: index
  }));

  // Tooltip personalizzato con più dettagli
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isInterpolated = hourlyForecast[payload[0].payload.index]?.interpolated;
      
      return (
        <>
          {/* Versione Mobile - Compatta */}
          <div className="sm:hidden bg-white bg-opacity-95 rounded-lg p-2 shadow-lg border border-blue-300">
            <p className="text-xs font-semibold text-gray-700 text-center">{data.time}</p>
            <p className="text-blue-600 font-bold text-lg text-center">{data.temperatura}°C</p>
            {isInterpolated && (
              <p className="text-[10px] text-gray-400 text-center italic">Stimato</p>
            )}
          </div>

          {/* Versione Desktop - Dettagliata */}
          <div className="hidden sm:block bg-white bg-opacity-95 rounded-lg p-4 shadow-lg border-2 border-blue-300">
            <p className="font-bold text-gray-800 mb-2 text-center">{data.time}</p>
            {isInterpolated && (
              <p className="text-xs text-gray-500 text-center mb-1 italic">Dato stimato</p>
            )}
            <div className="space-y-1">
              <p className="text-blue-600 font-bold text-xl text-center">{data.temperatura}°C</p>
              <p className="text-xs text-gray-600 text-center capitalize">{data.descrizione}</p>
              <div className="border-t border-gray-200 pt-2 mt-2 space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Min/Max:</span>
                  <span className="font-semibold">{data.tempMin}°C / {data.tempMax}°C</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Droplets className="h-3 w-3 mr-1 text-blue-500" />
                    <span className="text-gray-600">Umidità:</span>
                  </div>
                  <span className="font-semibold">{data.umidità}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Wind className="h-3 w-3 mr-1 text-gray-500" />
                    <span className="text-gray-600">Vento:</span>
                  </div>
                  <span className="font-semibold">{data.vento} km/h</span>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className="mt-4 sm:mt-6 md:mt-8 bg-white bg-opacity-10 rounded-lg p-3 sm:p-4 md:p-6">
      <div className="flex items-center justify-center mb-3 sm:mb-4">
        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-center">
          Andamento Temperatura - Prossime 48 Ore
        </h3>
      </div>
      
      <ResponsiveContainer width="100%" height={250} className="sm:hidden">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
          <XAxis 
            dataKey="time" 
            stroke="rgba(255,255,255,0.8)"
            style={{ fontSize: '9px' }}
            angle={-45}
            textAnchor="end"
            height={50}
            interval="preserveStartEnd"
            tickFormatter={(value, index) => {
              return index % 6 === 0 ? value : '';
            }}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.8)"
            style={{ fontSize: '10px' }}
            label={{ value: '°C', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.8)', style: { fontSize: '10px' } }}
            domain={['dataMin - 2', 'dataMax + 2']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="temperatura" 
            stroke="#3b82f6" 
            strokeWidth={2}
            fill="url(#colorTemp)"
            dot={false}
            activeDot={{ r: 4, fill: '#3b82f6' }}
          />
        </AreaChart>
      </ResponsiveContainer>
      
      <ResponsiveContainer width="100%" height={350} className="hidden sm:block">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
          <XAxis 
            dataKey="time" 
            stroke="rgba(255,255,255,0.8)"
            style={{ fontSize: '11px' }}
            angle={-45}
            textAnchor="end"
            height={60}
            interval="preserveStartEnd"
            tickFormatter={(value, index) => {
              // Mostra solo ogni 3° punto (ogni 3 ore) per evitare sovrapposizioni
              return index % 3 === 0 ? value : '';
            }}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.8)"
            style={{ fontSize: '12px' }}
            label={{ value: '°C', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.8)' }}
            domain={['dataMin - 2', 'dataMax + 2']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="temperatura" 
            stroke="#3b82f6" 
            strokeWidth={2}
            fill="url(#colorTemp)"
            dot={false}
            activeDot={{ r: 5, fill: '#3b82f6' }}
          />
        </AreaChart>
      </ResponsiveContainer>
      
      <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm opacity-75">
        <p className="hidden sm:block">Dati aggiornati ogni ora • Passa il mouse sui punti per i dettagli</p>
        <p className="sm:hidden">Dati aggiornati ogni ora • Tocca i punti per i dettagli</p>
      </div>
    </div>
  );
};

export default TemperatureChart;
