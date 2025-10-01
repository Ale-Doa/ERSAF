import express from 'express';
import axios from 'axios';
import { authenticateToken } from '../middleware/auth.js';
import { findUserById } from '../utils/fileManager.js';
import { sendPushNotification } from './push.js';

const router = express.Router();

// Ottieni meteo per l'utente corrente
router.get('/current', authenticateToken, async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }

    const weatherData = await getWeatherData(user.luogoResidenza, user.alertPreferences);
    
    // Invia notifica push se c'è un'allerta
    if (weatherData.hasAlert && user.pushSubscription) {
      await sendPushNotification(
        user,
        '⚠️ Allerta Meteo',
        weatherData.alertMessage,
        { city: weatherData.city }
      );
    }
    
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

// Endpoint di test per simulare allerte meteo
router.get('/test-alert/:type', authenticateToken, async (req, res) => {
  try {
    const { type } = req.params;
    const user = await findUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }

    // Ottieni dati meteo reali
    const realWeatherData = await getWeatherData(user.luogoResidenza);
    
    // Simula allerta in base al tipo
    const testData = generateTestAlert(type, realWeatherData);
    
    res.json(testData);
  } catch (error) {
    console.error('Errore nel test allerta:', error);
    res.status(500).json({ error: 'Errore nel test allerta' });
  }
});

// Funzione helper per ottenere dati meteo
async function getWeatherData(city, userPreferences = null) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    // Ottieni dati meteo attuali
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=it`;
    const currentResponse = await axios.get(currentUrl);
    const data = currentResponse.data;

    // Ottieni previsioni orarie (5 giorni, ogni 3 ore)
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=it`;
    const forecastResponse = await axios.get(forecastUrl);
    
    // Prendi i dati base (ogni 3 ore)
    const baseForecast = forecastResponse.data.list.slice(0, 16).map(item => ({
      time: new Date(item.dt * 1000).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
      timestamp: item.dt * 1000,
      temperature: Math.round(item.main.temp),
      tempMin: Math.round(item.main.temp_min),
      tempMax: Math.round(item.main.temp_max),
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      windSpeed: item.wind.speed,
      humidity: item.main.humidity,
      pressure: item.main.pressure,
      clouds: item.clouds.all
    }));

    // Interpola i dati per avere intervalli di 1 ora
    const hourlyForecast = [];
    for (let i = 0; i < baseForecast.length - 1; i++) {
      const current = baseForecast[i];
      const next = baseForecast[i + 1];
      
      // Aggiungi il punto corrente
      hourlyForecast.push(current);
      
      // Interpola 2 punti intermedi (1 ora e 2 ore dopo)
      for (let j = 1; j <= 2; j++) {
        const ratio = j / 3;
        const interpolatedTime = current.timestamp + (next.timestamp - current.timestamp) * ratio;
        
        hourlyForecast.push({
          time: new Date(interpolatedTime).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
          timestamp: interpolatedTime,
          temperature: Math.round(current.temperature + (next.temperature - current.temperature) * ratio),
          tempMin: Math.round(current.tempMin + (next.tempMin - current.tempMin) * ratio),
          tempMax: Math.round(current.tempMax + (next.tempMax - current.tempMax) * ratio),
          description: current.description, // Mantieni la descrizione del punto base
          icon: current.icon,
          windSpeed: current.windSpeed + (next.windSpeed - current.windSpeed) * ratio,
          humidity: Math.round(current.humidity + (next.humidity - current.humidity) * ratio),
          pressure: Math.round(current.pressure + (next.pressure - current.pressure) * ratio),
          clouds: Math.round(current.clouds + (next.clouds - current.clouds) * ratio),
          interpolated: true // Flag per indicare che è un dato interpolato
        });
      }
    }
    
    // Aggiungi l'ultimo punto
    hourlyForecast.push(baseForecast[baseForecast.length - 1]);

    // Determina se c'è un'allerta meteo basata sulle preferenze utente
    const hasAlert = checkWeatherAlert(data, userPreferences);

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
      alertMessage: hasAlert ? getAlertMessage(data, userPreferences) : null,
      hourlyForecast,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('Città non trovata');
    }
    throw error;
  }
}

// Funzione per verificare condizioni di allerta con preferenze personalizzate
function checkWeatherAlert(data, userPreferences = null) {
  const { main, weather, wind } = data;
  
  // Preferenze default se non specificate
  const prefs = userPreferences || {
    temperatureMin: 0,
    temperatureMax: 35,
    windSpeed: 50,
    enableThunderstorm: true,
    enableSnow: true,
    enableFog: true
  };
  
  // Controlla temperatura (converti windSpeed da km/h a m/s: km/h / 3.6)
  const coldAlert = main.temp < prefs.temperatureMin;
  const hotAlert = main.temp > prefs.temperatureMax;
  const windAlert = wind.speed > (prefs.windSpeed / 3.6);
  
  // Controlla condizioni meteo pericolose (solo se abilitate)
  const thunderstormAlert = prefs.enableThunderstorm && weather.some(w => w.main === 'Thunderstorm');
  const snowAlert = prefs.enableSnow && weather.some(w => w.main === 'Snow');
  const fogAlert = prefs.enableFog && weather.some(w => ['Mist', 'Fog'].includes(w.main));

  return coldAlert || hotAlert || windAlert || thunderstormAlert || snowAlert || fogAlert;
}

// Funzione per generare messaggio di allerta con preferenze personalizzate
function getAlertMessage(data, userPreferences = null) {
  const { main, weather, wind } = data;
  const alerts = [];

  // Preferenze default se non specificate
  const prefs = userPreferences || {
    temperatureMin: 0,
    temperatureMax: 35,
    windSpeed: 50,
    enableThunderstorm: true,
    enableSnow: true,
    enableFog: true
  };

  // Allerta freddo
  if (main.temp < prefs.temperatureMin) {
    alerts.push(`⚠️ Temperatura sotto ${prefs.temperatureMin}°C - Rischio ghiaccio`);
  }
  
  // Allerta caldo
  if (main.temp > prefs.temperatureMax) {
    alerts.push(`⚠️ Temperatura sopra ${prefs.temperatureMax}°C - Evitare esposizione prolungata`);
  }

  // Allerta vento (converti da m/s a km/h per il messaggio)
  if (wind.speed > (prefs.windSpeed / 3.6)) {
    alerts.push(`💨 Vento oltre ${prefs.windSpeed} km/h - Prestare attenzione`);
  }

  // Allerte condizioni meteo (solo se abilitate)
  weather.forEach(w => {
    if (w.main === 'Thunderstorm' && prefs.enableThunderstorm) {
      alerts.push('⛈️ Temporale in corso - Cercare riparo');
    } else if (w.main === 'Snow' && prefs.enableSnow) {
      alerts.push('🌨️ Nevicate - Prestare attenzione alla viabilità');
    } else if ((w.main === 'Mist' || w.main === 'Fog') && prefs.enableFog) {
      alerts.push('🌫️ Nebbia - Ridotta visibilità');
    }
  });

  return alerts.join(' | ');
}

// Funzione per generare allerte di test
function generateTestAlert(type, realData) {
  const testData = { ...realData };
  
  // Mantieni le previsioni orarie anche nei test
  if (!testData.hourlyForecast) {
    testData.hourlyForecast = [];
  }
  
  switch (type) {
    case 'cold':
      testData.temperature = -5;
      testData.feelsLike = -8;
      testData.hasAlert = true;
      testData.alertMessage = '⚠️ Temperatura sotto zero - Rischio ghiaccio';
      testData.description = 'cielo sereno (TEST)';
      break;
      
    case 'hot':
      testData.temperature = 38;
      testData.feelsLike = 42;
      testData.hasAlert = true;
      testData.alertMessage = '⚠️ Temperatura molto elevata - Evitare esposizione prolungata';
      testData.description = 'cielo sereno (TEST)';
      break;
      
    case 'wind':
      testData.windSpeed = 18.5;
      testData.hasAlert = true;
      testData.alertMessage = '💨 Vento forte - Prestare attenzione';
      testData.description = 'vento forte (TEST)';
      break;
      
    case 'storm':
      testData.hasAlert = true;
      testData.alertMessage = '⛈️ Temporale in corso - Cercare riparo';
      testData.description = 'temporale (TEST)';
      testData.icon = '11d';
      break;
      
    case 'snow':
      testData.temperature = -2;
      testData.hasAlert = true;
      testData.alertMessage = '🌨️ Nevicate - Prestare attenzione alla viabilità';
      testData.description = 'neve (TEST)';
      testData.icon = '13d';
      break;
      
    case 'fog':
      testData.hasAlert = true;
      testData.alertMessage = '🌫️ Nebbia - Ridotta visibilità';
      testData.description = 'nebbia (TEST)';
      testData.icon = '50d';
      break;
      
    case 'multiple':
      testData.temperature = -3;
      testData.windSpeed = 16;
      testData.hasAlert = true;
      testData.alertMessage = '⚠️ Temperatura sotto zero - Rischio ghiaccio | 💨 Vento forte - Prestare attenzione | 🌨️ Nevicate - Prestare attenzione alla viabilità';
      testData.description = 'condizioni estreme (TEST)';
      testData.icon = '13d';
      break;
      
    default:
      testData.hasAlert = true;
      testData.alertMessage = '🧪 Allerta di test generica';
      testData.description = 'test generico (TEST)';
  }
  
  return testData;
}

export default router;
