import { useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from './Avatar.jsx';

export default function PostComposer({ groupId, onCreated }) {
  const { user } = useAuth();
  const [text, setText] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const post = await api('/posts', { method: 'POST', body: { text, groupId } });
    setText('');
    onCreated(post);
  };

  return (
    <form className="card composer" onSubmit={submit}>
      <Avatar user={user} />
      <textarea placeholder={`Como foi o pedal hoje, ${user.name.split(' ')[0]}?`} value={text} onChange={(e) => setText(e.target.value)} />
      <button className="btn">Publicar</button>
    </form>
  );
}
