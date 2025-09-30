# 🧪 Sistema di Test per Allerte Meteo

## Panoramica

Il sistema di test permette di simulare diverse condizioni meteo pericolose senza dover aspettare che si verifichino realmente. Questo è utile per:

- **Sviluppo**: Testare l'interfaccia delle notifiche
- **Demo**: Mostrare le funzionalità dell'app
- **Debug**: Verificare il corretto funzionamento del sistema di allerte

⚠️ **Nota**: I test sono disponibili solo tramite chiamate API dirette, non tramite interfaccia utente, per mantenere un ambiente di produzione pulito.

## 🎯 Come Utilizzare

### Metodo 1: Postman / Insomnia / Thunder Client

1. **Ottieni il token JWT** effettuando il login
2. **Effettua una richiesta GET** all'endpoint di test
3. **Osserva la risposta** con i dati simulati

### Metodo 2: cURL (Terminale)

```bash
# Sostituisci YOUR_JWT_TOKEN con il token ottenuto dal login
curl -X GET http://localhost:5000/api/weather/test-alert/storm \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Metodo 3: Browser Console

```javascript
// Nella console del browser (dopo il login)
const token = localStorage.getItem('token');
fetch('/api/weather/test-alert/storm', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(res => res.json())
.then(data => console.log(data));
```

## 📋 Tipi di Test Disponibili

| Pulsante | Simula | Temperatura | Vento | Descrizione |
|----------|--------|-------------|-------|-------------|
| ❄️ **Freddo Estremo** | Temperatura sotto zero | -5°C | Normale | Rischio ghiaccio |
| 🔥 **Caldo Estremo** | Temperatura molto alta | 38°C | Normale | Evitare esposizione |
| 💨 **Vento Forte** | Vento pericoloso | Normale | 18.5 m/s | Prestare attenzione |
| ⛈️ **Temporale** | Temporale in corso | Normale | Normale | Cercare riparo |
| 🌨️ **Neve** | Nevicate | -2°C | Normale | Attenzione viabilità |
| 🌫️ **Nebbia** | Nebbia fitta | Normale | Normale | Ridotta visibilità |
| ⚠️ **Allerte Multiple** | Condizioni estreme | -3°C | 16 m/s | Neve + Vento + Freddo |

## 🔗 Endpoint API

**Base URL**: `http://localhost:5000/api/weather/test-alert/:type`

**Metodo**: GET

**Autenticazione**: Bearer Token (JWT)

**Parametri URL**:
- `type`: Tipo di allerta (`cold`, `hot`, `wind`, `storm`, `snow`, `fog`, `multiple`)

**Esempio Completo con Postman**:

1. **URL**: `http://localhost:5000/api/weather/test-alert/storm`
2. **Headers**:
   - `Authorization`: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. **Method**: GET
4. **Send**

**Risposta Attesa**: Oggetto meteo con `hasAlert: true` e dati simulati

## 🔧 Implementazione Tecnica

### Backend API

**Endpoint**: `GET /api/weather/test-alert/:type`

**Parametri**:
- `type`: Tipo di allerta da simulare (cold, hot, wind, storm, snow, fog, multiple)

**Autenticazione**: Richiede token JWT

**Risposta**: Oggetto meteo con dati simulati

```javascript
{
  "city": "Milano",
  "temperature": -5,
  "feelsLike": -8,
  "hasAlert": true,
  "alertMessage": "⚠️ Temperatura sotto zero - Rischio ghiaccio",
  "description": "cielo sereno (TEST)",
  // ... altri dati meteo reali
}
```

### Frontend

**Funzione**: `testAlert(type)`

```javascript
const testAlert = async (type) => {
  const response = await axios.get(`/api/weather/test-alert/${type}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  setWeather(response.data);
  setNotificationMessage(response.data.alertMessage);
  setShowNotification(true);
};
```

## 📋 Dettagli delle Simulazioni

### ❄️ Freddo Estremo
```json
{
  "temperature": -5,
  "feelsLike": -8,
  "alertMessage": "⚠️ Temperatura sotto zero - Rischio ghiaccio"
}
```

### 🔥 Caldo Estremo
```json
{
  "temperature": 38,
  "feelsLike": 42,
  "alertMessage": "⚠️ Temperatura molto elevata - Evitare esposizione prolungata"
}
```

### 💨 Vento Forte
```json
{
  "windSpeed": 18.5,
  "alertMessage": "💨 Vento forte - Prestare attenzione"
}
```

### ⛈️ Temporale
```json
{
  "icon": "11d",
  "alertMessage": "⛈️ Temporale in corso - Cercare riparo"
}
```

### 🌨️ Neve
```json
{
  "temperature": -2,
  "icon": "13d",
  "alertMessage": "🌨️ Nevicate - Prestare attenzione alla viabilità"
}
```

### 🌫️ Nebbia
```json
{
  "icon": "50d",
  "alertMessage": "🌫️ Nebbia - Ridotta visibilità"
}
```

### ⚠️ Allerte Multiple
```json
{
  "temperature": -3,
  "windSpeed": 16,
  "icon": "13d",
  "alertMessage": "⚠️ Temperatura sotto zero - Rischio ghiaccio | 💨 Vento forte - Prestare attenzione | 🌨️ Nevicate - Prestare attenzione alla viabilità"
}
```

## 🎨 Elementi UI Coinvolti

### 1. NotificationToast
- Appare in alto a destra
- Si chiude automaticamente dopo 10 secondi
- Può essere chiusa manualmente con la X
- Animazione slide-in

### 2. WeatherCard - Banner Allerta
- Banner rosso in cima alla card
- Icona di allerta
- Messaggio dettagliato
- Sempre visibile finché c'è un'allerta

### 3. Pannello Test
- Toggle on/off con pulsante
- 8 pulsanti colorati per tipo
- Disabilitati durante il caricamento
- Design responsive

## 🔍 Debugging

### Verificare che il Test Funzioni

1. **Apri la Console del Browser** (F12)
2. **Clicca su un test**
3. **Controlla**:
   - Chiamata API a `/api/weather/test-alert/:type`
   - Risposta con `hasAlert: true`
   - Aggiornamento dello stato `weather`
   - Comparsa della notifica

### Log Backend

Il backend logga:
```
Errore nel test allerta: [dettagli errore]
```

### Log Frontend

Il frontend logga:
```javascript
console.error('Errore nel test allerta:', err);
```

## 💡 Casi d'Uso

### 1. Demo per Stakeholder
Mostra rapidamente tutte le tipologie di allerta senza aspettare condizioni meteo reali.

### 2. Test UI/UX
Verifica che le notifiche siano visibili, leggibili e non invasive.

### 3. Test Responsive
Controlla che le notifiche funzionino su mobile, tablet e desktop.

### 4. Test Accessibilità
Verifica che le allerte siano accessibili con screen reader.

### 5. Sviluppo
Lavora sulle notifiche senza dipendere da condizioni meteo reali.

## 🚀 Estensioni Future

- [ ] Salvare lo storico dei test eseguiti
- [ ] Aggiungere test personalizzati
- [ ] Simulare sequenze di allerte
- [ ] Test automatici con screenshot
- [ ] Modalità "demo mode" per presentazioni

## ⚠️ Note Importanti

- I dati di test sono chiaramente marcati con "(TEST)"
- I dati reali vengono preservati e possono essere ripristinati
- Il sistema di test non modifica il database
- Le notifiche di test funzionano esattamente come quelle reali
- Il pannello di test è disponibile solo per utenti autenticati

---

**Buon testing! 🧪**
