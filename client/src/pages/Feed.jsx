import { useEffect, useState } from 'react';
import { api } from '../api.js';
import PostComposer from '../components/PostComposer.jsx';
import PostList from '../components/PostList.jsx';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    api('/posts').then(setPosts);
  }, []);

  return (
    <>
      <PostComposer onCreated={(p) => setPosts([p, ...posts])} />
      <PostList posts={posts} setPosts={setPosts} />
    </>
  );
}
