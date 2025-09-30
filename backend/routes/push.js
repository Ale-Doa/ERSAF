import express from 'express';
import webpush from 'web-push';
import { authenticateToken } from '../middleware/auth.js';
import { findUserById, updateUser } from '../utils/fileManager.js';

const router = express.Router();

// Configura web-push con le chiavi VAPID
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  console.log('✅ Chiavi VAPID caricate correttamente');
  console.log('📧 VAPID Subject:', process.env.VAPID_SUBJECT || 'mailto:admin@weatherapp.com');
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@weatherapp.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
} else {
  console.error('❌ ATTENZIONE: Chiavi VAPID NON trovate nel .env!');
  console.error('VAPID_PUBLIC_KEY presente:', !!process.env.VAPID_PUBLIC_KEY);
  console.error('VAPID_PRIVATE_KEY presente:', !!process.env.VAPID_PRIVATE_KEY);
}

// Ottieni la chiave pubblica VAPID
router.get('/vapid-public-key', (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY || '' });
});

// Salva subscription push per l'utente
router.post('/subscribe', authenticateToken, async (req, res) => {
  try {
    const { subscription } = req.body;
    
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Subscription non valida' });
    }

    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }

    // Salva la subscription nell'utente
    await updateUser(req.user.id, { pushSubscription: subscription });

    res.json({ message: 'Subscription salvata con successo' });
  } catch (error) {
    console.error('Errore nel salvataggio della subscription:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// Rimuovi subscription push
router.post('/unsubscribe', authenticateToken, async (req, res) => {
  try {
    await updateUser(req.user.id, { pushSubscription: null });
    res.json({ message: 'Subscription rimossa con successo' });
  } catch (error) {
    console.error('Errore nella rimozione della subscription:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// Funzione helper per inviare notifica push
export async function sendPushNotification(user, title, body, data = {}) {
  if (!user.pushSubscription) {
    return { success: false, reason: 'No subscription' };
  }

  const payload = JSON.stringify({
    title,
    body,
    icon: '/weather-icon.png',
    badge: '/badge-icon.png',
    data: {
      ...data,
      url: '/dashboard'
    }
  });

  try {
    await webpush.sendNotification(user.pushSubscription, payload);
    return { success: true };
  } catch (error) {
    console.error('Errore nell\'invio della notifica push:', error);
    
    // Se la subscription è scaduta o non valida, rimuovila
    if (error.statusCode === 410 || error.statusCode === 404) {
      await updateUser(user.id, { pushSubscription: null });
    }
    
    return { success: false, error: error.message };
  }
}

export default router;
