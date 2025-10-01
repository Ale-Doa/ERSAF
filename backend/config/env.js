import dotenv from 'dotenv';

// Carica le variabili d'ambiente all'avvio
dotenv.config();

// Debug: verifica che le variabili siano caricate
console.log('🔍 Debug variabili d\'ambiente:');
console.log('PORT:', process.env.PORT);
console.log('VAPID_PUBLIC_KEY presente:', !!process.env.VAPID_PUBLIC_KEY);
console.log('VAPID_PRIVATE_KEY presente:', !!process.env.VAPID_PRIVATE_KEY);
console.log('VAPID_SUBJECT:', process.env.VAPID_SUBJECT);

export default process.env;
