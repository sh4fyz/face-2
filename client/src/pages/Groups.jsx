import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Groups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });

  useEffect(() => {
    api('/groups').then(setGroups);
  }, []);

  const create = async (e) => {
    e.preventDefault();
    const g = await api('/groups', { method: 'POST', body: form });
    setGroups([...groups, g]);
    setForm({ name: '', description: '' });
  };
  const toggle = async (id) => {
    const g = await api(`/groups/${id}/join`, { method: 'POST' });
    setGroups(groups.map((x) => (x.id === id ? g : x)));
  };

  return (
    <>
      <form className="card stack" onSubmit={create}>
        <h3>Criar grupo</h3>
        <input placeholder="Nome (ex.: Pedal da Zona Sul)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="btn">Criar</button>
      </form>
      {groups.map((g) => {
        const member = g.members.includes(user.id);
        return (
          <div key={g.id} className="card row">
            <div>
              <Link to={`/grupos/${g.id}`} className="strong">{g.name}</Link>
              <p className="muted">{g.description} · {g.members.length} membro(s)</p>
            </div>
            <button className={member ? 'btn-ghost right' : 'btn right'} onClick={() => toggle(g.id)}>{member ? 'Sair' : 'Participar'}</button>
          </div>
        );
      })}
    </>
  );
}
