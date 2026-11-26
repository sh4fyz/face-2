import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from '../components/Avatar.jsx';
import PostComposer from '../components/PostComposer.jsx';
import PostList from '../components/PostList.jsx';

export default function Profile() {
  const { id } = useParams();
  const { user: me, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const isMe = me.id === id;

  const load = () => {
    api(`/users/${id}`).then(setProfile);
    api(`/posts?authorId=${id}`).then(setPosts);
  };
  useEffect(load, [id]);

  if (!profile) return <p className="center">Carregando...</p>;
  const isFriend = me.friends.includes(id);

  const toggleFriend = async () => {
    const { friends } = await api(`/users/${id}/friend`, { method: 'POST' });
    setUser({ ...me, friends: friends ? [...me.friends, id] : me.friends.filter((f) => f !== id) });
    load();
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const updated = await api('/users/me', { method: 'PATCH', body: data });
    setUser(updated);
    setEditing(false);
    load();
  };

  return (
    <>
      <section className="card profile-header">
        <div className="cover" />
        <div className="profile-info">
          <Avatar user={profile} size={96} />
          <div>
            <h2>{profile.name}</h2>
            <p className="muted">📍 {profile.city || 'Cidade não informada'} · {profile.friends.length} amigo(s)</p>
            <p>{profile.bio}</p>
          </div>
          <div className="right">
            {isMe ? (
              <button className="btn-ghost" onClick={() => setEditing(!editing)}>Editar perfil</button>
            ) : (
              <button className={isFriend ? 'btn-ghost' : 'btn'} onClick={toggleFriend}>{isFriend ? 'Desfazer amizade' : 'Adicionar amigo'}</button>
            )}
          </div>
        </div>
        {editing && (
          <form className="edit-form" onSubmit={saveProfile}>
            <input name="name" defaultValue={profile.name} placeholder="Nome" />
            <input name="city" defaultValue={profile.city} placeholder="Cidade" />
            <input name="avatar" defaultValue={profile.avatar} placeholder="URL da foto" />
            <textarea name="bio" defaultValue={profile.bio} placeholder="Bio" />
            <button className="btn">Salvar</button>
          </form>
        )}
      </section>

      <div className="profile-grid">
        <div>
          <section className="card">
            <h3>🚲 Garagem</h3>
            {profile.bikes.length ? (
              <ul className="plain">{profile.bikes.map((b) => <li key={b.id}><strong>{b.name}</strong> — {b.brand} {b.model} <span className="tag">{b.type}</span></li>)}</ul>
            ) : <p className="muted">Nenhuma bike cadastrada.</p>}
          </section>
          <section className="card">
            <h3>Amigos</h3>
            <ul className="plain">
              {profile.friendsList.map((f) => <li key={f.id}><Link to={`/perfil/${f.id}`}>{f.name}</Link></li>)}
            </ul>
          </section>
        </div>
        <div>
          {isMe && <PostComposer onCreated={(p) => setPosts([p, ...posts])} />}
          <PostList posts={posts} setPosts={setPosts} />
        </div>
      </div>
    </>
  );
}
