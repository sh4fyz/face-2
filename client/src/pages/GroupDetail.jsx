import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import PostComposer from '../components/PostComposer.jsx';
import PostList from '../components/PostList.jsx';

export default function GroupDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api(`/groups/${id}`).then(setGroup);
    api(`/posts?groupId=${id}`).then(setPosts);
  }, [id]);

  if (!group) return <p className="center">Carregando...</p>;
  const member = group.members.includes(user.id);

  return (
    <>
      <section className="card">
        <h2>{group.name}</h2>
        <p className="muted">{group.description} · {group.members.length} membro(s)</p>
      </section>
      {member ? <PostComposer groupId={id} onCreated={(p) => setPosts([p, ...posts])} /> : <p className="muted center">Entre no grupo para publicar.</p>}
      <PostList posts={posts} setPosts={setPosts} />
    </>
  );
}
