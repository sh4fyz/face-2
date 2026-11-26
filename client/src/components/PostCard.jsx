import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from './Avatar.jsx';

const fmt = (iso) => new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

export default function PostCard({ post, onChange, onDelete }) {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const liked = post.likes.includes(user.id);

  const like = async () => onChange(await api(`/posts/${post.id}/like`, { method: 'POST' }));
  const sendComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onChange(await api(`/posts/${post.id}/comments`, { method: 'POST', body: { text: comment } }));
    setComment('');
  };
  const remove = async () => {
    await api(`/posts/${post.id}`, { method: 'DELETE' });
    onDelete(post.id);
  };

  return (
    <article className="card post">
      <header className="post-header">
        <Avatar user={post.author} />
        <div>
          <Link to={`/perfil/${post.author.id}`} className="strong">{post.author.name}</Link>
          <small className="muted">{fmt(post.createdAt)}</small>
        </div>
        {post.author.id === user.id && <button className="btn-ghost right" onClick={remove}>Excluir</button>}
      </header>
      <p className="post-text">{post.text}</p>
      {post.image && <img src={post.image} alt="" className="post-image" />}
      <div className="post-stats muted">
        <span>🚴 {post.likes.length}</span>
        <span>{post.comments.length} comentário(s)</span>
      </div>
      <div className="post-actions">
        <button className={liked ? 'active' : ''} onClick={like}>🚴 {liked ? 'Pedalou junto' : 'Pedalar junto'}</button>
      </div>
      <ul className="comments">
        {post.comments.map((c) => (
          <li key={c.id}>
            <Avatar user={c.author} size={28} />
            <div className="bubble"><Link to={`/perfil/${c.author.id}`} className="strong">{c.author.name}</Link> {c.text}</div>
          </li>
        ))}
      </ul>
      <form onSubmit={sendComment} className="comment-form">
        <input placeholder="Escreva um comentário..." value={comment} onChange={(e) => setComment(e.target.value)} />
      </form>
    </article>
  );
}
