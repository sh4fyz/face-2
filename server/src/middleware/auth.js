import jwt from 'jsonwebtoken';
import { findUser } from '../db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'troque-este-segredo';

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Não autenticado' });
  try {
    const { sub } = jwt.verify(token, JWT_SECRET);
    const user = findUser(sub);
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
}
