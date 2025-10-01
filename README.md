# Weather App - Gestione Utenti e Meteo

Una web application completa per la gestione degli utenti con integrazione meteo in tempo reale e sistema di notifiche per allerte meteorologiche.

## 🌟 Caratteristiche

- **Autenticazione Utenti**: Sistema completo di registrazione e login con JWT
- **Gestione Profilo**: Modifica delle informazioni personali (nome, cognome, età, email, luogo di residenza)
- **Meteo in Tempo Reale**: Visualizzazione del meteo attuale basato sulla località dell'utente
- **Previsioni Orarie**: Grafico interattivo con previsioni dettagliate per le prossime 48 ore
- **Interpolazione Dati**: Dati meteo interpolati ogni ora per una visualizzazione fluida
- **Notifiche Push**: Sistema di notifiche push web con VAPID per allerte meteo
- **Notifiche Allerta**: Sistema di notifiche in-app per condizioni meteo pericolose
- **Preferenze Personalizzabili**: Ogni utente può configurare le proprie soglie di allerta
- **Aggiornamenti Automatici**: I dati meteo si aggiornano automaticamente ogni 5 minuti
- **API di Test**: Endpoint per simulare allerte meteo durante sviluppo (vedi [TESTING_ALERTS.md](TESTING_ALERTS.md))
- **UI Moderna e Responsive**: Interfaccia ottimizzata per mobile, tablet e desktop con Tailwind CSS
- **Grafici Interattivi**: Visualizzazione dell'andamento temperatura con Recharts

## 🛠️ Tecnologie Utilizzate

### Backend
- **Node.js** con **Express.js**
- **JWT** per l'autenticazione
- **bcryptjs** per la crittografia delle password
- **Axios** per le chiamate API
- **web-push** per le notifiche push con VAPID
- **dotenv** per la gestione delle variabili d'ambiente
- **File JSON** per la persistenza dei dati

### Frontend
- **React 18** 
- **React Router** per la navigazione
- **Tailwind CSS** per lo styling responsive
- **Lucide React** per le icone
- **Recharts** per i grafici interattivi
- **Vite** come build tool

### API Esterne
- **OpenWeatherMap API** per i dati meteorologici attuali e previsioni

## 📋 Prerequisiti

- Node.js (versione 16 o superiore)
- npm o yarn
- API Key di OpenWeatherMap (già inclusa nel progetto)

## 🚀 Installazione e Avvio

### 1. Clona il repository o scarica i file

```bash
cd ERSAF
```

### 2. Installazione Backend

```bash
cd backend
npm install
```

### 3. Configurazione Backend

Crea un file `.env` nella cartella `backend` con:
```
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_in_production
OPENWEATHER_API_KEY=your_openweather_api_key

# VAPID Keys per Web Push Notifications
# Genera le tue chiavi con: node generate-vapid-keys.js
VAPID_PUBLIC_KEY=your_vapid_public_key_here
VAPID_PRIVATE_KEY=your_vapid_private_key_here
VAPID_SUBJECT=mailto:your-email@example.com
```

**IMPORTANTE**: 
- In produzione, cambia il `JWT_SECRET` con una chiave sicura!
- Genera le chiavi VAPID eseguendo `node generate-vapid-keys.js` nella cartella backend
- Le chiavi VAPID sono necessarie per le notifiche push

### 4. Avvio Backend

```bash
npm start
```

Il server sarà disponibile su `http://localhost:5000`

### 5. Installazione Frontend (in un nuovo terminale)

```bash
cd frontend
npm install
```

### 6. Avvio Frontend

```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:3000`

## 📱 Utilizzo dell'Applicazione

### Registrazione
1. Apri `http://localhost:3000`
2. Clicca su "Registrati"
3. Compila il form con:
   - Nome
   - Cognome
   - Età
   - Email
   - Luogo di Residenza (es: Milano, Roma, Napoli)
   - Password (minimo 6 caratteri)
4. Clicca su "Registrati"

### Login
1. Inserisci email e password
2. Clicca su "Accedi"

### Dashboard
- Visualizza il meteo attuale per la tua località
- **Grafico temperatura**: Andamento delle prossime 48 ore con interpolazione oraria
- **Tooltip interattivo**: Passa il mouse (o tocca su mobile) per dettagli su ogni ora
- **Previsioni dettagliate**: Temperatura, umidità, vento, condizioni meteo
- Ricevi notifiche push e in-app in caso di allerta meteo
- Aggiorna manualmente i dati con il pulsante "Aggiorna"
- I dati si aggiornano automaticamente ogni 5 minuti
- **Design responsive**: Ottimizzato per mobile, tablet e desktop

### Gestione Profilo
1. Clicca su "Profilo" nella navbar
2. Modifica i tuoi dati personali
3. Clicca su "Salva Modifiche"
4. Puoi anche eliminare il tuo account (azione irreversibile)

### Personalizza Allerte ⚙️
1. Clicca su "Allerte" nella navbar
2. Configura le tue preferenze:
   - **Temperatura Minima**: Soglia per allerta freddo (es: -5°C)
   - **Temperatura Massima**: Soglia per allerta caldo (es: 40°C)
   - **Velocità Vento**: Soglia per allerta vento (es: 70 km/h)
   - **Condizioni Meteo**: Abilita/disabilita allerte per temporali, neve, nebbia
3. Clicca su "Salva Preferenze"
4. Le allerte verranno generate in base alle tue impostazioni

**Esempio**: Se imposti temperatura minima a 5°C, riceverai allerta solo quando la temperatura scende sotto 5°C (non più 0°C).

### Test Allerte Meteo 🧪

I test delle allerte sono disponibili tramite API per sviluppatori.

#### Test con Postman

**Step 1: Ottieni il Token**
1. Crea richiesta POST: `http://localhost:5000/api/auth/login`
2. Body (raw JSON):
   ```json
   {
     "email": "tua@email.com",
     "password": "tuapassword"
   }
   ```
3. Copia il `token` dalla risposta

**Step 2: Testa un'Allerta**
1. Crea richiesta GET: `http://localhost:5000/api/weather/test-alert/storm`
2. Headers: `Authorization: Bearer IL_TUO_TOKEN`
3. Invia e osserva la risposta con l'allerta simulata

**Tipi disponibili**: `cold`, `hot`, `wind`, `storm`, `snow`, `fog`, `multiple`

#### Test con cURL

```bash
# Sostituisci YOUR_TOKEN con il tuo JWT
curl -X GET http://localhost:5000/api/weather/test-alert/storm \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Test con Browser Console

```javascript
// Nella console del browser (F12) dopo il login
const token = localStorage.getItem('token');
fetch('http://localhost:5000/api/weather/test-alert/storm', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(res => res.json())
.then(data => console.log(data));
```

⚠️ **Importante**: Assicurati che il backend sia in esecuzione su porta 5000!

**Documentazione completa**: [TESTING_ALERTS.md](TESTING_ALERTS.md)

## 🌦️ Sistema di Allerta Meteo

### Soglie Default

L'applicazione monitora le seguenti condizioni (personalizzabili da ogni utente):

- **Temperatura Minima**: < 0°C
- **Temperatura Massima**: > 35°C
- **Vento Forte**: > 50 km/h
- **Condizioni Pericolose**: Temporali, neve, nebbia (abilitate di default)

### Personalizzazione

Ogni utente può configurare le proprie soglie nella pagina **Impostazioni Allerte**:
- Modifica temperature min/max in base al proprio clima
- Regola la soglia del vento
- Disabilita condizioni meteo non rilevanti (es: neve in zone calde)

### Notifiche

Quando viene rilevata un'allerta:
- Appare una notifica toast in alto a destra
- La card meteo mostra un banner rosso con i dettagli personalizzati
- La notifica rimane visibile per 10 secondi
- Il messaggio include la soglia configurata (es: "Temperatura sotto 5°C")

## 📁 Struttura del Progetto

```
ERSAF/
├── backend/
│   ├── config/
│   │   └── env.js              # Configurazione variabili d'ambiente
│   ├── data/
│   │   └── users.json          # Database utenti (JSON)
│   ├── middleware/
│   │   └── auth.js             # Middleware autenticazione JWT
│   ├── routes/
│   │   ├── auth.js             # Route autenticazione
│   │   ├── users.js            # Route gestione utenti
│   │   ├── weather.js          # Route dati meteo e previsioni
│   │   └── push.js             # Route notifiche push
│   ├── utils/
│   │   └── fileManager.js      # Gestione file JSON
│   ├── .env                    # Variabili d'ambiente (non in git)
│   ├── .env.example            # Template variabili d'ambiente
│   ├── .gitignore
│   ├── generate-vapid-keys.js  # Script per generare chiavi VAPID
│   ├── package.json
│   └── server.js               # Entry point backend
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Navbar responsive
│   │   │   ├── WeatherCard.jsx         # Card meteo principale
│   │   │   ├── TemperatureChart.jsx    # Grafico temperatura
│   │   │   ├── PushNotificationToggle.jsx  # Toggle notifiche push
│   │   │   └── NotificationToast.jsx   # Toast notifiche
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx           # Dashboard con grafico
│   │   │   ├── Profile.jsx
│   │   │   └── AlertSettings.jsx
│   │   ├── utils/
│   │   │   └── pushNotifications.js    # Gestione push notifications
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css                   # Stili globali + responsive
│   ├── public/
│   │   └── service-worker.js           # Service Worker per push
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

## 🔐 API Endpoints

### Autenticazione
- `POST /api/auth/register` - Registrazione nuovo utente
- `POST /api/auth/login` - Login utente

### Utenti (richiede autenticazione)
- `GET /api/users/profile` - Ottieni profilo utente
- `PUT /api/users/profile` - Aggiorna profilo utente
- `DELETE /api/users/profile` - Elimina account
- `GET /api/users/alert-preferences` - Ottieni preferenze allerte
- `PUT /api/users/alert-preferences` - Aggiorna preferenze allerte

### Meteo (richiede autenticazione)
- `GET /api/weather/current` - Meteo attuale + previsioni 48h (con interpolazione oraria)
- `GET /api/weather/city/:city` - Meteo per città specifica
- `GET /api/weather/test-alert/:type` - Simula allerta per test (dev only)

### Push Notifications (richiede autenticazione)
- `GET /api/push/vapid-public-key` - Ottieni chiave pubblica VAPID
- `POST /api/push/subscribe` - Registra subscription push
- `POST /api/push/unsubscribe` - Rimuovi subscription push

## 🔒 Sicurezza

- Password crittografate con bcrypt
- Autenticazione JWT con token a scadenza (24h)
- Validazione input su backend e frontend
- Protezione route con middleware di autenticazione
- CORS configurato per ambiente di sviluppo

## 🎨 Features UI/UX

### Design Responsive
- **Mobile-first**: Ottimizzato per schermi piccoli (320px+)
- **Breakpoints Tailwind**: sm (640px), md (768px), lg (1024px)
- **Touch-friendly**: Pulsanti e aree touch ottimizzate per mobile
- **Font scalabili**: Dimensioni adattive per ogni dispositivo
- **Navbar compatta**: Solo icone su mobile, testo completo su desktop

### Grafico Temperatura
- **Recharts**: Grafico ad area interattivo
- **48 ore di previsioni**: Con interpolazione oraria
- **Tooltip responsive**: Versione compatta su mobile, dettagliata su desktop
- **Gradiente animato**: Effetto visivo moderno
- **Zoom e pan**: Interazione fluida con i dati

### Altre Features
- Animazioni fluide con transizioni CSS
- Feedback visivo per tutte le azioni
- Loading states con spinner
- Error handling con messaggi chiari
- Icone intuitive (Lucide React)
- Gradient colorati e moderni
- Toast notifications per allerte
- Push notifications web
- Smooth scrolling su iOS

## 📊 Gestione Dati

I dati degli utenti sono salvati in `backend/data/users.json` con la seguente struttura:

```json
[
  {
    "id": "uuid-v4",
    "nome": "Mario",
    "cognome": "Rossi",
    "eta": 30,
    "email": "mario@email.com",
    "password": "hash_bcrypt",
    "luogoResidenza": "Milano",
    "alertPreferences": {
      "temperatureMin": 0,
      "temperatureMax": 35,
      "windSpeed": 50,
      "enableThunderstorm": true,
      "enableSnow": true,
      "enableFog": true
    },
    "pushSubscription": {
      "endpoint": "https://fcm.googleapis.com/...",
      "keys": {
        "p256dh": "...",
        "auth": "..."
      }
    },
    "createdAt": "2025-09-30T15:00:00.000Z"
  }
]
```

## 🐛 Troubleshooting

### Il backend non si avvia
- Verifica che la porta 5000 sia libera
- Controlla che Node.js sia installato correttamente
- Verifica che tutte le dipendenze siano installate

### Il frontend non si connette al backend
- Assicurati che il backend sia in esecuzione
- Verifica il proxy in `vite.config.js`
- Controlla la console del browser per errori

### Dati meteo non caricati
- Verifica la connessione internet
- Controlla che l'API key di OpenWeatherMap sia valida
- Assicurati che il luogo di residenza sia scritto correttamente

### Errore "Città non trovata"
- Usa nomi di città in italiano o inglese
- Prova varianti del nome (es: "Rome" invece di "Roma")
- Verifica l'ortografia

### Le notifiche push non funzionano
- Verifica che le chiavi VAPID siano configurate nel `.env`
- Genera nuove chiavi con `node generate-vapid-keys.js`
- Controlla che il browser supporti le notifiche push
- Assicurati di aver dato il permesso per le notifiche

### Il grafico non si visualizza
- Verifica che `recharts` sia installato: `npm install recharts`
- Controlla la console del browser per errori
- Riavvia il server frontend dopo l'installazione

## 🚀 Deployment

### Backend
1. Configura le variabili d'ambiente su piattaforma di hosting
2. Cambia `JWT_SECRET` con valore sicuro
3. Deploy su Heroku, Railway, Render, ecc.

### Frontend
1. Build production: `npm run build`
2. Deploy cartella `dist` su Vercel, Netlify, ecc.
3. Configura variabile d'ambiente per URL backend

## 📝 Note di Sviluppo

### Dati e API
- Il file `users.json` viene creato automaticamente al primo avvio
- In produzione, considera l'uso di un database (MongoDB, PostgreSQL)
- L'API key di OpenWeatherMap ha limiti di chiamate (60 chiamate/minuto)
- Il token JWT scade dopo 24 ore

### Previsioni Meteo
- I dati base sono forniti ogni 3 ore dall'API OpenWeatherMap
- L'interpolazione lineare crea punti intermedi ogni ora
- Le previsioni interpolate sono marcate come "Dato stimato" nel tooltip
- Totale: ~48 punti dati per 48 ore di previsioni

### Notifiche Push
- Utilizzano il protocollo Web Push con VAPID
- Richiedono HTTPS in produzione (localhost funziona in sviluppo)
- Il Service Worker gestisce le notifiche in background
- Le subscription sono salvate nel profilo utente

### Responsive Design
- Breakpoint principale: 640px (sm) per mobile/desktop
- Font minimo 16px su input mobile per prevenire zoom iOS
- Touch-action: manipulation per migliore interazione touch
- Grafico con due versioni: compatta (mobile) e completa (desktop)

## 🤝 Contributi

Questo progetto è stato creato come demo. Sentiti libero di:
- Aggiungere nuove funzionalità
- Migliorare l'UI/UX
- Ottimizzare le performance
- Aggiungere test

## 📄 Licenza

ISC

## 👨‍💻 Autore

Progetto sviluppato per dimostrazione tecnica.

---

**Buon utilizzo! 🌤️**
