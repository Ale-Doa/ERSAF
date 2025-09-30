import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, addUser } from '../utils/fileManager.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Registrazione
router.post('/register', async (req, res) => {
  try {
    const { nome, cognome, eta, email, password, luogoResidenza } = req.body;

    // Validazione
    if (!nome || !cognome || !eta || !email || !password || !luogoResidenza) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }

    // Verifica se l'utente esiste già
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email già registrata' });
    }

    // Hash della password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea nuovo utente
    const newUser = {
      id: uuidv4(),
      nome,
      cognome,
      eta: parseInt(eta),
      email,
      password: hashedPassword,
      luogoResidenza,
      createdAt: new Date().toISOString()
    };

    await addUser(newUser);

    // Genera token JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Rimuovi password dalla risposta
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: 'Registrazione completata con successo',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    res.status(500).json({ error: 'Errore del server durante la registrazione' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validazione
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e password sono obbligatori' });
    }

    // Trova utente
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    // Verifica password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    // Genera token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Rimuovi password dalla risposta
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login effettuato con successo',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Errore durante il login:', error);
    res.status(500).json({ error: 'Errore del server durante il login' });
  }
});

export default router;
