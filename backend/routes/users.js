import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { findUserById, updateUser, deleteUser } from '../utils/fileManager.js';

const router = express.Router();

// Ottieni profilo utente corrente
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Errore nel recupero del profilo:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// Aggiorna profilo utente
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { nome, cognome, eta, luogoResidenza } = req.body;
    
    const updatedData = {};
    if (nome) updatedData.nome = nome;
    if (cognome) updatedData.cognome = cognome;
    if (eta) updatedData.eta = parseInt(eta);
    if (luogoResidenza) updatedData.luogoResidenza = luogoResidenza;

    const updatedUser = await updateUser(req.user.id, updatedData);
    const { password, ...userWithoutPassword } = updatedUser;

    res.json({
      message: 'Profilo aggiornato con successo',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Errore nell\'aggiornamento del profilo:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// Elimina account
router.delete('/profile', authenticateToken, async (req, res) => {
  try {
    await deleteUser(req.user.id);
    res.json({ message: 'Account eliminato con successo' });
  } catch (error) {
    console.error('Errore nell\'eliminazione dell\'account:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// Ottieni preferenze allerte
router.get('/alert-preferences', authenticateToken, async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }

    // Se l'utente non ha preferenze (utenti vecchi), usa i default
    const defaultPreferences = {
      temperatureMin: 0,
      temperatureMax: 35,
      windSpeed: 50,
      enableThunderstorm: true,
      enableSnow: true,
      enableFog: true
    };

    res.json(user.alertPreferences || defaultPreferences);
  } catch (error) {
    console.error('Errore nel recupero delle preferenze:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// Aggiorna preferenze allerte
router.put('/alert-preferences', authenticateToken, async (req, res) => {
  try {
    const { temperatureMin, temperatureMax, windSpeed, enableThunderstorm, enableSnow, enableFog } = req.body;
    
    // Validazione
    if (temperatureMin !== undefined && (temperatureMin < -50 || temperatureMin > 50)) {
      return res.status(400).json({ error: 'Temperatura minima non valida (-50 a 50°C)' });
    }
    if (temperatureMax !== undefined && (temperatureMax < -50 || temperatureMax > 60)) {
      return res.status(400).json({ error: 'Temperatura massima non valida (-50 a 60°C)' });
    }
    if (windSpeed !== undefined && (windSpeed < 0 || windSpeed > 200)) {
      return res.status(400).json({ error: 'Velocità vento non valida (0 a 200 km/h)' });
    }

    const user = await findUserById(req.user.id);
    const currentPreferences = user.alertPreferences || {};

    const updatedPreferences = {
      temperatureMin: temperatureMin !== undefined ? parseFloat(temperatureMin) : currentPreferences.temperatureMin,
      temperatureMax: temperatureMax !== undefined ? parseFloat(temperatureMax) : currentPreferences.temperatureMax,
      windSpeed: windSpeed !== undefined ? parseFloat(windSpeed) : currentPreferences.windSpeed,
      enableThunderstorm: enableThunderstorm !== undefined ? enableThunderstorm : currentPreferences.enableThunderstorm,
      enableSnow: enableSnow !== undefined ? enableSnow : currentPreferences.enableSnow,
      enableFog: enableFog !== undefined ? enableFog : currentPreferences.enableFog
    };

    await updateUser(req.user.id, { alertPreferences: updatedPreferences });

    res.json({
      message: 'Preferenze aggiornate con successo',
      preferences: updatedPreferences
    });
  } catch (error) {
    console.error('Errore nell\'aggiornamento delle preferenze:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
});

export default router;
