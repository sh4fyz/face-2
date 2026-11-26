import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, save, newId, publicUser } from '../db.js';
import { requireAuth, JWT_SECRET } from '../middleware/auth.js';

const router = Router();
const sign = (user) => jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '7d' });

router.post('/register', (req, res) => {
  const { name, email, password, city = '' } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Preencha nome, e-mail e senha' });
  if (db.users.some((u) => u.email === email)) return res.status(409).json({ error: 'E-mail já cadastrado' });
  const user = { id: newId(), name, email, password: bcrypt.hashSync(password, 8), bio: '', city, avatar: '', friends: [], createdAt: new Date().toISOString() };
  db.users.push(user);
  save();
  res.status(201).json({ token: sign(user), user: publicUser(user) });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find((u) => u.email === email);
  if (!user || !bcrypt.compareSync(password || '', user.password)) return res.status(401).json({ error: 'E-mail ou senha inválidos' });
  res.json({ token: sign(user), user: publicUser(user) });
});

router.get('/me', requireAuth, (req, res) => res.json(publicUser(req.user)));

export default router;
