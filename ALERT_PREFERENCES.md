# ⚙️ Sistema di Preferenze Allerte Personalizzabili

## Panoramica

Ogni utente può configurare le proprie soglie di allerta meteo in base alle proprie esigenze e al proprio clima locale. Il sistema genera notifiche solo quando le condizioni superano i valori personalizzati.

## 🎯 Perché Personalizzare?

### Esempi Pratici

**Utente in Sicilia** (clima mediterraneo caldo):
- Temperatura max: 40°C (abituato al caldo)
- Neve: ❌ Disabilitata (non nevica mai)
- Risultato: Nessuna allerta fastidiosa per temperature normali

**Utente in Trentino** (clima alpino freddo):
- Temperatura min: -10°C (abituato al freddo)
- Neve: ✅ Abilitata (importante per viabilità)
- Risultato: Allerte rilevanti per il contesto locale

**Utente in Pianura Padana** (nebbia frequente):
- Nebbia: ❌ Disabilitata (fenomeno quotidiano)
- Risultato: Nessuna allerta per nebbia normale

## 📋 Parametri Configurabili

### 1. Temperatura Minima (°C)

**Range**: -50°C a 50°C  
**Default**: 0°C  
**Descrizione**: Ricevi allerta quando la temperatura scende sotto questo valore

**Esempi**:
- `5°C` - Zone temperate
- `0°C` - Zone continentali
- `-5°C` - Zone fredde
- `-10°C` - Zone alpine/nordiche

### 2. Temperatura Massima (°C)

**Range**: -50°C a 60°C  
**Default**: 35°C  
**Descrizione**: Ricevi allerta quando la temperatura supera questo valore

**Esempi**:
- `30°C` - Zone fresche
- `35°C` - Zone temperate
- `40°C` - Zone calde
- `45°C` - Zone desertiche

### 3. Velocità Vento (km/h)

**Range**: 0 a 200 km/h  
**Default**: 50 km/h  
**Descrizione**: Ricevi allerta quando il vento supera questo valore

**Esempi**:
- `40 km/h` - Sensibilità alta
- `50 km/h` - Sensibilità media (default)
- `70 km/h` - Sensibilità bassa (zone ventose)
- `90 km/h` - Solo venti molto forti

### 4. Temporali

**Tipo**: Checkbox (on/off)  
**Default**: ✅ Abilitato  
**Descrizione**: Ricevi allerta in caso di temporali

**Disabilita se**:
- Vivi in zona con temporali frequenti
- Non sei preoccupato dai temporali

### 5. Neve

**Tipo**: Checkbox (on/off)  
**Default**: ✅ Abilitato  
**Descrizione**: Ricevi allerta in caso di nevicate

**Disabilita se**:
- Vivi in zona dove non nevica mai
- Sei abituato alla neve e non ti serve l'allerta

### 6. Nebbia

**Tipo**: Checkbox (on/off)  
**Default**: ✅ Abilitato  
**Descrizione**: Ricevi allerta in caso di nebbia

**Disabilita se**:
- Vivi in zona con nebbia quotidiana (es: Pianura Padana)
- Non guidi e la nebbia non ti impatta

## 🔧 Come Configurare

### Via Interfaccia Web

1. **Login** nell'applicazione
2. **Clicca** su "Allerte" nella navbar
3. **Modifica** i valori desiderati
4. **Clicca** "Salva Preferenze"
5. **Fatto!** Le nuove soglie sono attive immediatamente

### Via API

**Endpoint**: `PUT /api/users/alert-preferences`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Body**:
```json
{
  "temperatureMin": -5,
  "temperatureMax": 40,
  "windSpeed": 70,
  "enableThunderstorm": true,
  "enableSnow": false,
  "enableFog": true
}
```

**Risposta**:
```json
{
  "message": "Preferenze aggiornate con successo",
  "preferences": {
    "temperatureMin": -5,
    "temperatureMax": 40,
    "windSpeed": 70,
    "enableThunderstorm": true,
    "enableSnow": false,
    "enableFog": true
  }
}
```

## 📊 Schema Dati Utente

Ogni utente ha un oggetto `alertPreferences` nel database:

```json
{
  "id": "uuid",
  "nome": "Mario",
  "cognome": "Rossi",
  "email": "mario@email.com",
  "luogoResidenza": "Milano",
  "alertPreferences": {
    "temperatureMin": 0,
    "temperatureMax": 35,
    "windSpeed": 50,
    "enableThunderstorm": true,
    "enableSnow": true,
    "enableFog": true
  }
}
```

## 🔄 Retrocompatibilità

Gli utenti registrati prima dell'implementazione delle preferenze:
- Ricevono automaticamente le preferenze **default**
- Possono modificarle in qualsiasi momento
- Nessuna migrazione manuale richiesta

## 💡 Messaggi Personalizzati

Le notifiche mostrano le soglie configurate:

**Con soglie default**:
```
⚠️ Temperatura sotto 0°C - Rischio ghiaccio
```

**Con soglie personalizzate** (es: -5°C):
```
⚠️ Temperatura sotto -5°C - Rischio ghiaccio
```

Questo aiuta l'utente a capire perché ha ricevuto l'allerta.

## ✅ Validazione

Il backend valida tutti i valori:

- **Temperatura Min**: -50°C ≤ valore ≤ 50°C
- **Temperatura Max**: -50°C ≤ valore ≤ 60°C
- **Vento**: 0 km/h ≤ valore ≤ 200 km/h
- **Checkbox**: true o false

Valori fuori range vengono rifiutati con errore 400.

## 🎨 Interfaccia Utente

La pagina **Impostazioni Allerte** include:

### Sezione Temperatura
- 2 input numerici (min/max)
- Descrizioni chiare
- Icona termometro

### Sezione Vento
- 1 input numerico
- Step di 5 km/h
- Icona vento

### Sezione Condizioni
- 3 checkbox
- Emoji per identificazione rapida
- Icona nuvola

### Pulsanti
- **Salva Preferenze** (blu) - Salva modifiche
- **Ripristina Default** (grigio) - Torna ai valori iniziali

### Info Box
- Spiegazione del funzionamento
- Suggerimenti d'uso

## 🚀 Best Practices

### Per Utenti

1. **Inizia con i default** e modifica solo se necessario
2. **Testa le soglie** per qualche giorno
3. **Regola gradualmente** in base alle notifiche ricevute
4. **Considera il clima locale** nella configurazione

### Per Sviluppatori

1. **Valida sempre** i valori sul backend
2. **Usa preferenze default** per utenti senza configurazione
3. **Documenta** i range validi
4. **Testa** con valori estremi

## 📝 Esempi di Configurazione

### Configurazione "Sensibile"
```json
{
  "temperatureMin": 5,
  "temperatureMax": 30,
  "windSpeed": 40,
  "enableThunderstorm": true,
  "enableSnow": true,
  "enableFog": true
}
```
Ricevi molte notifiche, ideale per chi vuole essere sempre informato.

### Configurazione "Bilanciata" (Default)
```json
{
  "temperatureMin": 0,
  "temperatureMax": 35,
  "windSpeed": 50,
  "enableThunderstorm": true,
  "enableSnow": true,
  "enableFog": true
}
```
Notifiche per condizioni realmente pericolose.

### Configurazione "Rilassata"
```json
{
  "temperatureMin": -10,
  "temperatureMax": 40,
  "windSpeed": 70,
  "enableThunderstorm": false,
  "enableSnow": false,
  "enableFog": false
}
```
Solo notifiche per condizioni estreme.

## 🔍 Troubleshooting

**Non ricevo allerte**:
- Verifica che le soglie non siano troppo estreme
- Controlla che le condizioni meteo siano abilitate
- Verifica che il meteo reale superi le tue soglie

**Ricevo troppe allerte**:
- Aumenta le soglie di temperatura
- Aumenta la soglia del vento
- Disabilita condizioni non rilevanti

**Le modifiche non si salvano**:
- Verifica la connessione internet
- Controlla che i valori siano nel range valido
- Verifica di essere autenticato

---

**Personalizza le tue allerte per un'esperienza su misura! ⚙️**
