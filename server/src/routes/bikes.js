// "Garagem": bicicletas cadastradas pelo usuário.
import { Router } from 'express';
import { db, save, newId } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/mine', (req, res) => res.json(db.bikes.filter((b) => b.ownerId === req.user.id)));

router.post('/', (req, res) => {
  const { name, brand = '', model = '', type = 'urbana', year } = req.body;
  if (!name) return res.status(400).json({ error: 'Dê um nome para a bike' });
  const bike = { id: newId(), ownerId: req.user.id, name, brand, model, type, year: year ? Number(year) : null, createdAt: new Date().toISOString() };
  db.bikes.push(bike);
  save();
  res.status(201).json(bike);
});

router.delete('/:id', (req, res) => {
  const bike = db.bikes.find((b) => b.id === req.params.id);
  if (!bike || bike.ownerId !== req.user.id) return res.status(404).json({ error: 'Bike não encontrada' });
  db.bikes = db.bikes.filter((b) => b.id !== bike.id);
  save();
  res.status(204).end();
});

export default router;
