# 🚀 Quick Start Guide

## Avvio Rapido (Windows)

### Opzione 1: Script Automatico
1. Doppio click su `install.bat` per installare le dipendenze
2. Doppio click su `start.bat` per avviare l'applicazione
3. Apri il browser su `http://localhost:3000`

### Opzione 2: Manuale

**Terminale 1 - Backend:**
```bash
cd backend
npm install
npm start
```

**Terminale 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📝 Primo Utilizzo

1. **Registrati**: Vai su `http://localhost:3000/register`
   - Compila tutti i campi
   - Usa una città reale per il luogo di residenza (es: Milano, Roma, Napoli)
   
2. **Visualizza Meteo**: Dopo il login, vedrai automaticamente il meteo della tua città

3. **Ricevi Allerte**: Se ci sono condizioni meteo pericolose, riceverai una notifica

## 🌍 Città Supportate

Puoi usare qualsiasi città del mondo. Esempi:
- **Italia**: Milano, Roma, Napoli, Torino, Firenze, Bologna, Venezia
- **Europa**: London, Paris, Berlin, Madrid, Amsterdam
- **Mondo**: New York, Tokyo, Sydney, Dubai

## ⚡ Funzionalità Principali

- ✅ Registrazione e Login
- ✅ Dashboard con meteo in tempo reale
- ✅ Notifiche allerta meteo automatiche
- ✅ **Preferenze allerte personalizzabili** (nuovo! ⚙️)
- ✅ Aggiornamento automatico ogni 5 minuti
- ✅ **Sistema di test per allerte** (API dev 🧪)
- ✅ Gestione profilo utente
- ✅ UI moderna e responsive

## 🔑 Credenziali di Test

Dopo la registrazione, usa le tue credenziali per accedere.

## ⚙️ Personalizza le Allerte

1. **Vai su "Allerte"** nella navbar
2. **Configura le soglie**:
   - Temperatura minima/massima
   - Velocità vento
   - Abilita/disabilita temporali, neve, nebbia
3. **Salva** e ricevi allerte personalizzate!

**Esempio**: Vivi in Sicilia? Imposta temp. max a 40°C e disabilita la neve!

## 🧪 Testare le Notifiche (Sviluppatori)

I test delle allerte sono disponibili tramite API:

```bash
# Nella console del browser (dopo il login)
const token = localStorage.getItem('token');
fetch('/api/weather/test-alert/storm', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(res => res.json())
.then(data => console.log(data));
```

**Tipi**: `cold`, `hot`, `wind`, `storm`, `snow`, `fog`, `multiple`

📖 **Guida completa**: [TESTING_ALERTS.md](TESTING_ALERTS.md)

## 🆘 Problemi Comuni

**Porta già in uso:**
- Backend (5000): Chiudi altre applicazioni sulla porta 5000
- Frontend (3000): Chiudi altre applicazioni sulla porta 3000

**Meteo non caricato:**
- Verifica la connessione internet
- Controlla che il nome della città sia corretto
- Prova con "Milan" invece di "Milano" o viceversa

**Errore dipendenze:**
- Assicurati di avere Node.js installato (v16+)
- Esegui `npm install` in entrambe le cartelle

## 📱 Accesso

Una volta avviato, apri il browser su:
**http://localhost:3000**

---

**Buon divertimento! 🌤️**
