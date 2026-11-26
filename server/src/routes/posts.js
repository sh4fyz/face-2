import { Router } from 'express';
import { db, save, newId, publicUser, findUser } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

const expand = (p) => ({
  ...p,
  author: publicUser(findUser(p.authorId)),
  comments: p.comments.map((c) => ({ ...c, author: publicUser(findUser(c.authorId)) })),
});

// Feed: posts do usuário e dos amigos. ?authorId= filtra por perfil, ?groupId= por grupo.
router.get('/', (req, res) => {
  const { authorId, groupId } = req.query;
  let posts = db.posts;
  if (groupId) posts = posts.filter((p) => p.groupId === groupId);
  else if (authorId) posts = posts.filter((p) => p.authorId === authorId && !p.groupId);
  else {
    const visible = new Set([req.user.id, ...req.user.friends]);
    posts = posts.filter((p) => visible.has(p.authorId) && !p.groupId);
  }
  res.json([...posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(expand));
});

router.post('/', (req, res) => {
  const { text, image = '', groupId } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'Post vazio' });
  const post = { id: newId(), authorId: req.user.id, text: text.trim(), image, groupId, likes: [], comments: [], createdAt: new Date().toISOString() };
  db.posts.push(post);
  save();
  res.status(201).json(expand(post));
});

router.delete('/:id', (req, res) => {
  const post = db.posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post não encontrado' });
  if (post.authorId !== req.user.id) return res.status(403).json({ error: 'Sem permissão' });
  db.posts = db.posts.filter((p) => p.id !== post.id);
  save();
  res.status(204).end();
});

router.post('/:id/like', (req, res) => {
  const post = db.posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post não encontrado' });
  post.likes = post.likes.includes(req.user.id) ? post.likes.filter((id) => id !== req.user.id) : [...post.likes, req.user.id];
  save();
  res.json(expand(post));
});

router.post('/:id/comments', (req, res) => {
  const post = db.posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post não encontrado' });
  if (!req.body.text?.trim()) return res.status(400).json({ error: 'Comentário vazio' });
  post.comments.push({ id: newId(), authorId: req.user.id, text: req.body.text.trim(), createdAt: new Date().toISOString() });
  save();
  res.status(201).json(expand(post));
});

export default router;
