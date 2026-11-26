import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from '../components/Avatar.jsx';

export default function People() {
  const { user } = useAuth();
  const [q, setQ] = useState('');
  const [people, setPeople] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => api(`/users?q=${encodeURIComponent(q)}`).then(setPeople), 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <>
      <div className="card">
        <input placeholder="Buscar ciclistas..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {people.filter((p) => p.id !== user.id).map((p) => (
        <div key={p.id} className="card row">
          <Avatar user={p} />
          <div>
            <Link to={`/perfil/${p.id}`} className="strong">{p.name}</Link>
            <p className="muted">{p.city} {user.friends.includes(p.id) && '· Amigo(a)'}</p>
          </div>
        </div>
      ))}
    </>
  );
}
