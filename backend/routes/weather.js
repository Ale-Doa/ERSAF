import express from 'express';
import axios from 'axios';
import { authenticateToken } from '../middleware/auth.js';
import { findUserById } from '../utils/fileManager.js';

const router = express.Router();

// Ottieni meteo per l'utente corrente
router.get('/current', authenticateToken, async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }

    const weatherData = await getWeatherData(user.luogoResidenza);
    res.json(weatherData);
  } catch (error) {
    console.error('Errore nel recupero dei dati meteo:', error);
    res.status(500).json({ error: 'Errore nel recupero dei dati meteo' });
  }
});

// Ottieni meteo per una città specifica
router.get('/city/:city', authenticateToken, async (req, res) => {
  try {
    const { city } = req.params;
    const weatherData = await getWeatherData(city);
    res.json(weatherData);
  } catch (error) {
    console.error('Errore nel recupero dei dati meteo:', error);
    res.status(500).json({ error: 'Errore nel recupero dei dati meteo' });
  }
});

// Funzione helper per ottenere dati meteo
async function getWeatherData(city) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=it`;
    
    const response = await axios.get(url);
    const data = response.data;

    // Determina se c'è un'allerta meteo
    const hasAlert = checkWeatherAlert(data);

    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      windSpeed: data.wind.speed,
      clouds: data.clouds.all,
      hasAlert,
      alertMessage: hasAlert ? getAlertMessage(data) : null,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('Città non trovata');
    }
    throw error;
  }
}

// Funzione per verificare condizioni di allerta
function checkWeatherAlert(data) {
  const { main, weather, wind } = data;
  
  // Condizioni di allerta:
  // - Temperatura estrema (< 0°C o > 35°C)
  // - Vento forte (> 50 km/h = 13.89 m/s)
  // - Condizioni meteo pericolose (temporale, neve intensa, nebbia)
  
  const extremeTemp = main.temp < 0 || main.temp > 35;
  const strongWind = wind.speed > 13.89;
  const dangerousConditions = weather.some(w => 
    ['Thunderstorm', 'Snow', 'Mist', 'Fog'].includes(w.main)
  );

  return extremeTemp || strongWind || dangerousConditions;
}

// Funzione per generare messaggio di allerta
function getAlertMessage(data) {
  const { main, weather, wind } = data;
  const alerts = [];

  if (main.temp < 0) {
    alerts.push('⚠️ Temperatura sotto zero - Rischio ghiaccio');
  } else if (main.temp > 35) {
    alerts.push('⚠️ Temperatura molto elevata - Evitare esposizione prolungata');
  }

  if (wind.speed > 13.89) {
    alerts.push('💨 Vento forte - Prestare attenzione');
  }

  weather.forEach(w => {
    if (w.main === 'Thunderstorm') {
      alerts.push('⛈️ Temporale in corso - Cercare riparo');
    } else if (w.main === 'Snow') {
      alerts.push('🌨️ Nevicate - Prestare attenzione alla viabilità');
    } else if (w.main === 'Mist' || w.main === 'Fog') {
      alerts.push('🌫️ Nebbia - Ridotta visibilità');
    }
  });

  return alerts.join(' | ');
}

export default router;
