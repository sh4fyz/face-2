import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', city: '' });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <form className="card auth-form" onSubmit={submit}>
        <h2>Criar conta</h2>
        <input placeholder="Nome" value={form.name} onChange={set('name')} />
        <input type="email" placeholder="E-mail" value={form.email} onChange={set('email')} />
        <input type="password" placeholder="Senha" value={form.password} onChange={set('password')} />
        <input placeholder="Cidade" value={form.city} onChange={set('city')} />
        {error && <p className="error">{error}</p>}
        <button className="btn btn-green">Cadastrar</button>
        <Link to="/login">Já tenho conta</Link>
      </form>
    </div>
  );
}
