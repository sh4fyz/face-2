import { useEffect, useState } from 'react';
import { api } from '../api.js';

const empty = { name: '', brand: '', model: '', type: 'urbana', year: '' };
const TYPES = ['urbana', 'speed', 'mtb', 'gravel', 'bmx', 'eletrica', 'dobravel'];

export default function Garage() {
  const [bikes, setBikes] = useState([]);
  const [form, setForm] = useState(empty);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    api('/bikes/mine').then(setBikes);
  }, []);

  const add = async (e) => {
    e.preventDefault();
    const b = await api('/bikes', { method: 'POST', body: form });
    setBikes([...bikes, b]);
    setForm(empty);
  };
  const remove = async (id) => {
    await api(`/bikes/${id}`, { method: 'DELETE' });
    setBikes(bikes.filter((b) => b.id !== id));
  };

  return (
    <>
      <form className="card stack" onSubmit={add}>
        <h3>🔧 Adicionar bike à garagem</h3>
        <input placeholder="Apelido da bike" value={form.name} onChange={set('name')} />
        <div className="row">
          <input placeholder="Marca" value={form.brand} onChange={set('brand')} />
          <input placeholder="Modelo" value={form.model} onChange={set('model')} />
          <input type="number" placeholder="Ano" value={form.year} onChange={set('year')} />
          <select value={form.type} onChange={set('type')}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
        </div>
        <button className="btn">Adicionar</button>
      </form>
      {bikes.map((b) => (
        <div key={b.id} className="card row">
          <div>
            <span className="strong">{b.name}</span> <span className="tag">{b.type}</span>
            <p className="muted">{b.brand} {b.model} {b.year && `· ${b.year}`}</p>
          </div>
          <button className="btn-ghost right" onClick={() => remove(b.id)}>Remover</button>
        </div>
      ))}
    </>
  );
}
