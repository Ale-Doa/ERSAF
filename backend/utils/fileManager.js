import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_FILE = path.join(__dirname, '../data/users.json');

export const readUsers = async () => {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Se il file non esiste, ritorna array vuoto
    if (error.code === 'ENOENT') {
      await writeUsers([]);
      return [];
    }
    throw error;
  }
};

export const writeUsers = async (users) => {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    throw new Error('Errore nella scrittura del file utenti');
  }
};

export const findUserByEmail = async (email) => {
  const users = await readUsers();
  return users.find(user => user.email === email);
};

export const findUserById = async (id) => {
  const users = await readUsers();
  return users.find(user => user.id === id);
};

export const addUser = async (user) => {
  const users = await readUsers();
  users.push(user);
  await writeUsers(users);
  return user;
};

export const updateUser = async (id, updatedData) => {
  const users = await readUsers();
  const index = users.findIndex(user => user.id === id);
  
  if (index === -1) {
    throw new Error('Utente non trovato');
  }
  
  users[index] = { ...users[index], ...updatedData };
  await writeUsers(users);
  return users[index];
};

export const deleteUser = async (id) => {
  const users = await readUsers();
  const filteredUsers = users.filter(user => user.id !== id);
  
  if (users.length === filteredUsers.length) {
    throw new Error('Utente non trovato');
  }
  
  await writeUsers(filteredUsers);
  return true;
};
