import PostCard from './PostCard.jsx';

export default function PostList({ posts, setPosts }) {
  if (!posts.length) return <p className="muted center">Nenhuma publicação ainda.</p>;
  return posts.map((p) => (
    <PostCard
      key={p.id}
      post={p}
      onChange={(updated) => setPosts((list) => list.map((x) => (x.id === updated.id ? updated : x)))}
      onDelete={(id) => setPosts((list) => list.filter((x) => x.id !== id))}
    />
  ));
}
