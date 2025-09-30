# Weather App - Gestione Utenti e Meteo

Una web application completa per la gestione degli utenti con integrazione meteo in tempo reale e sistema di notifiche per allerte meteorologiche.

## 🌟 Caratteristiche

- **Autenticazione Utenti**: Sistema completo di registrazione e login con JWT
- **Gestione Profilo**: Modifica delle informazioni personali (nome, cognome, età, email, luogo di residenza)
- **Meteo in Tempo Reale**: Visualizzazione del meteo attuale basato sulla località dell'utente
- **Notifiche Allerta**: Sistema di notifiche in-app per condizioni meteo pericolose
- **Aggiornamenti Automatici**: I dati meteo si aggiornano automaticamente ogni 5 minuti
- **UI Moderna**: Interfaccia utente responsive e moderna con Tailwind CSS

## 🛠️ Tecnologie Utilizzate

### Backend
- **Node.js** con **Express.js**
- **JWT** per l'autenticazione
- **bcryptjs** per la crittografia delle password
- **Axios** per le chiamate API
- **File JSON** per la persistenza dei dati

### Frontend
- **React 18** (ultima versione)
- **React Router** per la navigazione
- **Tailwind CSS** per lo styling
- **Lucide React** per le icone
- **Vite** come build tool

### API Esterne
- **OpenWeatherMap API** per i dati meteorologici

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

Il file `.env` è già configurato con:
```
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_in_production
OPENWEATHER_API_KEY=21d284eec703e073efcac0647c11a509
```

**IMPORTANTE**: In produzione, cambia il `JWT_SECRET` con una chiave sicura!

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
- Ricevi notifiche in caso di allerta meteo
- Aggiorna manualmente i dati con il pulsante "Aggiorna"
- I dati si aggiornano automaticamente ogni 5 minuti

### Gestione Profilo
1. Clicca su "Profilo" nella navbar
2. Modifica i tuoi dati personali
3. Clicca su "Salva Modifiche"
4. Puoi anche eliminare il tuo account (azione irreversibile)

## 🌦️ Sistema di Allerta Meteo

L'applicazione monitora le seguenti condizioni e genera allerte:

- **Temperatura Estrema**: < 0°C o > 35°C
- **Vento Forte**: > 50 km/h
- **Condizioni Pericolose**: Temporali, neve intensa, nebbia

Quando viene rilevata un'allerta:
- Appare una notifica toast in alto a destra
- La card meteo mostra un banner rosso con i dettagli
- La notifica rimane visibile per 10 secondi

## 📁 Struttura del Progetto

```
ERSAF/
├── backend/
│   ├── data/
│   │   └── users.json          # Database utenti (JSON)
│   ├── middleware/
│   │   └── auth.js             # Middleware autenticazione JWT
│   ├── routes/
│   │   ├── auth.js             # Route autenticazione
│   │   ├── users.js            # Route gestione utenti
│   │   └── weather.js          # Route dati meteo
│   ├── utils/
│   │   └── fileManager.js      # Gestione file JSON
│   ├── .env                    # Variabili d'ambiente
│   ├── .gitignore
│   ├── package.json
│   └── server.js               # Entry point backend
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── WeatherCard.jsx
│   │   │   └── NotificationToast.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Profile.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
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

### Meteo (richiede autenticazione)
- `GET /api/weather/current` - Meteo per località utente
- `GET /api/weather/city/:city` - Meteo per città specifica

## 🔒 Sicurezza

- Password crittografate con bcrypt
- Autenticazione JWT con token a scadenza (24h)
- Validazione input su backend e frontend
- Protezione route con middleware di autenticazione
- CORS configurato per ambiente di sviluppo

## 🎨 Features UI/UX

- Design responsive (mobile, tablet, desktop)
- Animazioni fluide
- Feedback visivo per tutte le azioni
- Loading states
- Error handling con messaggi chiari
- Icone intuitive (Lucide React)
- Gradient colorati e moderni
- Toast notifications per allerte

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

- Il file `users.json` viene creato automaticamente al primo avvio
- In produzione, considera l'uso di un database (MongoDB, PostgreSQL)
- L'API key di OpenWeatherMap ha limiti di chiamate (60 chiamate/minuto)
- Il token JWT scade dopo 24 ore

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
