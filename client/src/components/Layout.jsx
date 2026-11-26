import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from './Avatar.jsx';

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <>
      <header className="topbar">
        <NavLink to="/" className="logo">🚲 PedalBook</NavLink>
        <nav>
          <NavLink to="/" end>Feed</NavLink>
          <NavLink to="/pedais">Pedais</NavLink>
          <NavLink to="/grupos">Grupos</NavLink>
          <NavLink to="/pessoas">Pessoas</NavLink>
        </nav>
        <div className="topbar-user">
          <NavLink to={`/perfil/${user.id}`} className="user-chip">
            <Avatar user={user} size={28} /> {user.name.split(' ')[0]}
          </NavLink>
          <button className="btn-ghost" onClick={logout}>Sair</button>
        </div>
      </header>
      <div className="shell">
        <aside className="sidebar">
          <NavLink to={`/perfil/${user.id}`}>👤 Meu perfil</NavLink>
          <NavLink to="/garagem">🔧 Minha garagem</NavLink>
          <NavLink to="/pedais">📍 Pedais</NavLink>
          <NavLink to="/grupos">👥 Grupos</NavLink>
          <NavLink to="/pessoas">🤝 Encontrar ciclistas</NavLink>
        </aside>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </>
  );
}
