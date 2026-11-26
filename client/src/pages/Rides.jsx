import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

const empty = { title: '', description: '', date: '', location: '', distanceKm: '', level: 'iniciante' };

export default function Rides() {
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    api('/rides').then(setRides);
  }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      const r = await api('/rides', { method: 'POST', body: { ...form, date: form.date && new Date(form.date).toISOString() } });
      setRides([...rides, r].sort((a, b) => a.date.localeCompare(b.date)));
      setForm(empty);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };
  const toggle = async (id) => {
    const r = await api(`/rides/${id}/join`, { method: 'POST' });
    setRides(rides.map((x) => (x.id === id ? r : x)));
  };

  return (
    <>
      <form className="card stack" onSubmit={create}>
        <h3>📍 Organizar um pedal</h3>
        <input placeholder="Título" value={form.title} onChange={set('title')} />
        <div className="row">
          <input type="datetime-local" value={form.date} onChange={set('date')} />
          <input type="number" placeholder="Distância (km)" value={form.distanceKm} onChange={set('distanceKm')} />
          <select value={form.level} onChange={set('level')}>
            <option value="iniciante">Iniciante</option>
            <option value="intermediario">Intermediário</option>
            <option value="avancado">Avançado</option>
          </select>
        </div>
        <input placeholder="Ponto de encontro" value={form.location} onChange={set('location')} />
        <textarea placeholder="Descrição" value={form.description} onChange={set('description')} />
        {error && <p className="error">{error}</p>}
        <button className="btn">Criar pedal</button>
      </form>

      {rides.map((r) => {
        const going = r.participants.includes(user.id);
        return (
          <div key={r.id} className="card ride">
            <div className="ride-date">
              <strong>{new Date(r.date).getDate()}</strong>
              <small>{new Date(r.date).toLocaleString('pt-BR', { month: 'short' })}</small>
            </div>
            <div>
              <span className="strong">{r.title}</span> <span className="tag">{r.level}</span>
              <p className="muted">
                📍 {r.location} · {r.distanceKm} km · {new Date(r.date).toLocaleTimeString('pt-BR', { timeStyle: 'short' })}
              </p>
              <p>{r.description}</p>
              <small className="muted">Organizado por <Link to={`/perfil/${r.organizer.id}`}>{r.organizer.name}</Link> · {r.participants.length} confirmado(s)</small>
            </div>
            <button className={going ? 'btn-ghost right' : 'btn right'} onClick={() => toggle(r.id)}>{going ? 'Cancelar' : 'Vou!'}</button>
          </div>
        );
      })}
    </>
  );
}
