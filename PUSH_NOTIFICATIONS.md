# 📱 Notifiche Push - Guida Completa

## Panoramica

L'applicazione supporta **notifiche push** tramite Web Push API. Gli utenti ricevono allerte meteo anche quando l'app non è aperta o il browser è chiuso.

## 🎯 Caratteristiche

- ✅ **Notifiche in Background**: Ricevi allerte anche con app chiusa
- ✅ **Cross-Browser**: Funziona su Chrome, Firefox, Edge, Opera
- ✅ **Personalizzabili**: Basate sulle preferenze utente
- ✅ **Sicure**: Usa protocollo VAPID standard
- ✅ **Opt-in**: L'utente deve dare il permesso esplicito

## 🔧 Setup Iniziale

### 1. Genera Chiavi VAPID

Le chiavi VAPID sono necessarie per identificare il server che invia le notifiche.

```bash
cd backend
npx web-push generate-vapid-keys
```

Output:
```
=======================================
Public Key:
BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U

Private Key:
UUxI4O8-FbRouAevSmBQ6o8eDy6VV5pBsFkWfqR9Aq8
=======================================
```

### 2. Configura .env

Copia le chiavi generate nel file `.env`:

```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_in_production
OPENWEATHER_API_KEY=21d284eec703e073efcac0647c11a509

# VAPID Keys per Web Push Notifications
VAPID_PUBLIC_KEY=BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U
VAPID_PRIVATE_KEY=UUxI4O8-FbRouAevSmBQ6o8eDy6VV5pBsFkWfqR9Aq8
VAPID_SUBJECT=mailto:admin@weatherapp.com
```

### 3. Installa Dipendenze

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 4. Avvia l'Applicazione

```bash
# Terminale 1 - Backend
cd backend
npm start

# Terminale 2 - Frontend  
cd frontend
npm run dev
```

## 📱 Come Funziona

### Flusso Utente

1. **Login** nell'applicazione
2. **Vai su** "Allerte" nella navbar
3. **Clicca** "Abilita" nel box "Notifiche Push"
4. **Accetta** il permesso nel browser
5. **Fatto!** Riceverai notifiche push per le allerte

### Flusso Tecnico

```
1. Frontend richiede permesso → Browser mostra popup
2. Utente accetta → Frontend registra Service Worker
3. Service Worker si sottoscrive → Ottiene subscription object
4. Frontend invia subscription → Backend salva nel database
5. Allerta rilevata → Backend invia push notification
6. Service Worker riceve → Mostra notifica all'utente
```

## 🔐 API Endpoints

### Ottieni Chiave Pubblica VAPID

```bash
GET /api/push/vapid-public-key
```

**Risposta**:
```json
{
  "publicKey": "BEl62iUYgUivxIkv..."
}
```

### Sottoscrivi alle Notifiche

```bash
POST /api/push/subscribe
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "subscription": {
    "endpoint": "https://fcm.googleapis.com/fcm/send/...",
    "keys": {
      "p256dh": "...",
      "auth": "..."
    }
  }
}
```

**Risposta**:
```json
{
  "message": "Subscription salvata con successo"
}
```

### Annulla Sottoscrizione

```bash
POST /api/push/unsubscribe
Authorization: Bearer TOKEN
```

**Risposta**:
```json
{
  "message": "Subscription rimossa con successo"
}
```

## 💻 Implementazione Backend

### Configurazione web-push

```javascript
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:admin@weatherapp.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);
```

### Invio Notifica

```javascript
export async function sendPushNotification(user, title, body, data = {}) {
  if (!user.pushSubscription) {
    return { success: false, reason: 'No subscription' };
  }

  const payload = JSON.stringify({
    title,
    body,
    icon: '/weather-icon.png',
    data: { ...data, url: '/dashboard' }
  });

  try {
    await webpush.sendNotification(user.pushSubscription, payload);
    return { success: true };
  } catch (error) {
    // Gestisci subscription scadute
    if (error.statusCode === 410 || error.statusCode === 404) {
      await updateUser(user.id, { pushSubscription: null });
    }
    return { success: false, error: error.message };
  }
}
```

### Integrazione con Allerte

```javascript
// In routes/weather.js
const weatherData = await getWeatherData(user.luogoResidenza, user.alertPreferences);

if (weatherData.hasAlert && user.pushSubscription) {
  await sendPushNotification(
    user,
    '⚠️ Allerta Meteo',
    weatherData.alertMessage,
    { city: weatherData.city }
  );
}
```

## 🎨 Implementazione Frontend

### Service Worker

```javascript
// public/service-worker.js
self.addEventListener('push', function(event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    data: data.data,
    vibrate: [200, 100, 200],
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
```

### Sottoscrizione

```javascript
import { subscribeToPushNotifications } from './utils/pushNotifications';

const result = await subscribeToPushNotifications(token);
if (result.success) {
  console.log('Sottoscritto con successo!');
}
```

## 🌐 Supporto Browser

| Browser | Supporto | Note |
|---------|----------|------|
| **Chrome** | ✅ Sì | Desktop e Android |
| **Firefox** | ✅ Sì | Desktop e Android |
| **Edge** | ✅ Sì | Desktop |
| **Opera** | ✅ Sì | Desktop e Android |
| **Safari** | ⚠️ Limitato | Solo macOS 13+ e iOS 16.4+ |
| **IE** | ❌ No | Non supportato |

## 🔍 Debugging

### Verifica Service Worker

1. Apri DevTools (F12)
2. Vai su **Application** → **Service Workers**
3. Verifica che `service-worker.js` sia registrato e attivo

### Verifica Subscription

```javascript
// Nella console del browser
navigator.serviceWorker.ready.then(registration => {
  registration.pushManager.getSubscription().then(sub => {
    console.log('Subscription:', sub);
  });
});
```

### Test Manuale Notifica

```javascript
// Nella console del browser (dopo aver abilitato le notifiche)
new Notification('Test', {
  body: 'Questa è una notifica di test',
  icon: '/weather-icon.png'
});
```

## ⚠️ Problemi Comuni

### "Notifiche non supportate"

**Causa**: Browser non supporta Web Push API  
**Soluzione**: Usa Chrome, Firefox o Edge aggiornati

### "Permesso negato"

**Causa**: Utente ha bloccato le notifiche  
**Soluzione**: 
1. Clicca sull'icona 🔒 nella barra indirizzi
2. Impostazioni sito → Notifiche → Consenti

### "Subscription non salvata"

**Causa**: Chiavi VAPID non configurate  
**Soluzione**: Verifica che `.env` contenga le chiavi VAPID

### "Notifiche non arrivano"

**Causa**: Service Worker non registrato  
**Soluzione**: 
1. Controlla console per errori
2. Verifica che `/service-worker.js` sia accessibile
3. Ricarica la pagina con Ctrl+F5

## 🔒 Sicurezza

### Best Practices

1. **Non condividere** la chiave privata VAPID
2. **Usa HTTPS** in produzione (obbligatorio per Service Workers)
3. **Valida** sempre le subscription sul backend
4. **Gestisci** subscription scadute (status 410)
5. **Limita** la frequenza di invio per evitare spam

### Gestione Subscription Scadute

```javascript
if (error.statusCode === 410 || error.statusCode === 404) {
  // Subscription non più valida, rimuovila
  await updateUser(user.id, { pushSubscription: null });
}
```

## 📊 Schema Dati

### Subscription Object

```json
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "expirationTime": null,
  "keys": {
    "p256dh": "BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlUls0VJXg7A8u-Ts1XbjhazAkj7I99e8QcYP7DkM=",
    "auth": "tBHItJI5svbpez7KI4CCXg=="
  }
}
```

### User Object (con subscription)

```json
{
  "id": "uuid",
  "nome": "Mario",
  "email": "mario@email.com",
  "pushSubscription": {
    "endpoint": "...",
    "keys": { "p256dh": "...", "auth": "..." }
  }
}
```

## 🚀 Deployment

### Produzione

1. **Genera nuove chiavi VAPID** per produzione
2. **Configura HTTPS** (obbligatorio)
3. **Aggiorna VAPID_SUBJECT** con email reale
4. **Testa** su dispositivi reali
5. **Monitora** log per subscription scadute

### Variabili d'Ambiente

```env
# Produzione
VAPID_PUBLIC_KEY=<chiave_pubblica_produzione>
VAPID_PRIVATE_KEY=<chiave_privata_produzione>
VAPID_SUBJECT=mailto:support@tuodominio.com
```

## 💡 Tips & Tricks

### Personalizza Icone

Crea icone personalizzate:
- `public/weather-icon.png` (192x192px) - Icona grande
- `public/badge-icon.png` (96x96px) - Badge piccolo

### Vibrazione Personalizzata

```javascript
vibrate: [200, 100, 200, 100, 200] // Vibra 3 volte
```

### Notifica Persistente

```javascript
requireInteraction: true // Rimane finché l'utente non la chiude
```

### Azioni Notifica

```javascript
actions: [
  { action: 'view', title: 'Visualizza' },
  { action: 'dismiss', title: 'Ignora' }
]
```

## 📚 Risorse

- [Web Push Protocol](https://datatracker.ietf.org/doc/html/rfc8030)
- [VAPID Specification](https://datatracker.ietf.org/doc/html/rfc8292)
- [MDN: Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [web-push npm](https://www.npmjs.com/package/web-push)

---

**Le notifiche push rendono l'app ancora più utile! 📱**
