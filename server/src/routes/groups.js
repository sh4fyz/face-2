import { Router } from 'express';
import { db, save, newId } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', (_req, res) => res.json(db.groups));

router.get('/:id', (req, res) => {
  const group = db.groups.find((g) => g.id === req.params.id);
  if (!group) return res.status(404).json({ error: 'Grupo não encontrado' });
  res.json(group);
});

router.post('/', (req, res) => {
  const { name, description = '' } = req.body;
  if (!name) return res.status(400).json({ error: 'Informe o nome do grupo' });
  const group = { id: newId(), name, description, members: [req.user.id], createdAt: new Date().toISOString() };
  db.groups.push(group);
  save();
  res.status(201).json(group);
});

router.post('/:id/join', (req, res) => {
  const group = db.groups.find((g) => g.id === req.params.id);
  if (!group) return res.status(404).json({ error: 'Grupo não encontrado' });
  group.members = group.members.includes(req.user.id) ? group.members.filter((id) => id !== req.user.id) : [...group.members, req.user.id];
  save();
  res.json(group);
});

export default router;
