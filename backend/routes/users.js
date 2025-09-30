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

export default router;
