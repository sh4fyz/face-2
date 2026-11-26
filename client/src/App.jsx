import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Feed from './pages/Feed.jsx';
import Profile from './pages/Profile.jsx';
import Groups from './pages/Groups.jsx';
import GroupDetail from './pages/GroupDetail.jsx';
import Rides from './pages/Rides.jsx';
import Garage from './pages/Garage.jsx';
import People from './pages/People.jsx';

function Private({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="center">Carregando...</p>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />
      <Route element={<Private><Layout /></Private>}>
        <Route path="/" element={<Feed />} />
        <Route path="/perfil/:id" element={<Profile />} />
        <Route path="/grupos" element={<Groups />} />
        <Route path="/grupos/:id" element={<GroupDetail />} />
        <Route path="/pedais" element={<Rides />} />
        <Route path="/garagem" element={<Garage />} />
        <Route path="/pessoas" element={<People />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
