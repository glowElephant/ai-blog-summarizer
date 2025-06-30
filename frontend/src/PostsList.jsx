import { useEffect, useState } from 'react';
import { fetchPosts } from './api';
import { Link } from 'react-router-dom';

export default function PostsList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts().then(setPosts);
  }, []);

  return (
    <div>
      <h2>게시물 목록</h2>
      {posts.map(p => (
        <div className="post-card" key={p.id}>
          <Link to={`/posts/${p.id}`}>{p.title}</Link>
          <p className="post-meta">{p.author} / {p.created_at}</p>
        </div>
      ))}
    </div>
  );
}
