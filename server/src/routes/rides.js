// "Pedais": eventos de pedal em grupo (equivalente aos Eventos do Facebook).
import { Router } from 'express';
import { db, save, newId, publicUser, findUser } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

const expand = (r) => ({ ...r, organizer: publicUser(findUser(r.organizerId)) });

router.get('/', (_req, res) => {
  res.json([...db.rides].sort((a, b) => a.date.localeCompare(b.date)).map(expand));
});

router.post('/', (req, res) => {
  const { title, description = '', date, location, distanceKm = 0, level = 'iniciante' } = req.body;
  if (!title || !date || !location) return res.status(400).json({ error: 'Informe título, data e local' });
  const ride = { id: newId(), title, description, date, location, distanceKm: Number(distanceKm), level, organizerId: req.user.id, participants: [req.user.id], createdAt: new Date().toISOString() };
  db.rides.push(ride);
  save();
  res.status(201).json(expand(ride));
});

router.post('/:id/join', (req, res) => {
  const ride = db.rides.find((r) => r.id === req.params.id);
  if (!ride) return res.status(404).json({ error: 'Pedal não encontrado' });
  ride.participants = ride.participants.includes(req.user.id) ? ride.participants.filter((id) => id !== req.user.id) : [...ride.participants, req.user.id];
  save();
  res.json(expand(ride));
});

export default router;
