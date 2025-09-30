import axios from 'axios';

// Converti chiave VAPID da base64 a Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Verifica se le notifiche push sono supportate
export function isPushNotificationSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

// Richiedi permesso per le notifiche
export async function askUserPermission() {
  if (!isPushNotificationSupported()) {
    return { granted: false, reason: 'not-supported' };
  }

  const permission = await Notification.requestPermission();
  return { granted: permission === 'granted', permission };
}

// Registra service worker
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service Worker non supportato');
  }

  const registration = await navigator.serviceWorker.register('/service-worker.js');
  return registration;
}

// Sottoscrivi alle notifiche push
export async function subscribeToPushNotifications(token) {
  try {
    // Registra service worker
    const registration = await registerServiceWorker();
    
    // Ottieni chiave pubblica VAPID dal server
    const { data } = await axios.get('/api/push/vapid-public-key');
    const vapidPublicKey = data.publicKey;

    if (!vapidPublicKey) {
      throw new Error('Chiave VAPID non configurata sul server');
    }

    // Sottoscrivi alle push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
    });

    // Invia subscription al server
    await axios.post('/api/push/subscribe', 
      { subscription },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { success: true, subscription };
  } catch (error) {
    console.error('Errore nella sottoscrizione push:', error);
    return { success: false, error: error.message };
  }
}

// Annulla sottoscrizione
export async function unsubscribeFromPushNotifications(token) {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
    }

    // Rimuovi subscription dal server
    await axios.post('/api/push/unsubscribe',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { success: true };
  } catch (error) {
    console.error('Errore nella cancellazione sottoscrizione:', error);
    return { success: false, error: error.message };
  }
}

// Verifica se l'utente è già sottoscritto
export async function isPushSubscribed() {
  if (!isPushNotificationSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription !== null;
  } catch (error) {
    return false;
  }
}
