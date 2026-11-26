import { Router } from 'express';
import { db, save, publicUser, findUser } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  res.json(db.users.filter((u) => u.name.toLowerCase().includes(q)).map(publicUser));
});

router.get('/:id', (req, res) => {
  const user = findUser(req.params.id);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json({
    ...publicUser(user),
    friendsList: user.friends.map((id) => publicUser(findUser(id))).filter(Boolean),
    bikes: db.bikes.filter((b) => b.ownerId === user.id),
  });
});

router.patch('/me', (req, res) => {
  const { name, bio, city, avatar } = req.body;
  Object.assign(req.user, Object.fromEntries(Object.entries({ name, bio, city, avatar }).filter(([, v]) => v !== undefined)));
  save();
  res.json(publicUser(req.user));
});

// Amizade simplificada: adicionar/remover direto (sem solicitação pendente).
router.post('/:id/friend', (req, res) => {
  const other = findUser(req.params.id);
  if (!other || other.id === req.user.id) return res.status(400).json({ error: 'Usuário inválido' });
  const isFriend = req.user.friends.includes(other.id);
  if (isFriend) {
    req.user.friends = req.user.friends.filter((id) => id !== other.id);
    other.friends = other.friends.filter((id) => id !== req.user.id);
  } else {
    req.user.friends.push(other.id);
    other.friends.push(req.user.id);
  }
  save();
  res.json({ friends: !isFriend });
});

export default router;
