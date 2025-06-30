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
      <h1>게시물 목록</h1>
      <ul>
        {posts.map(p => (
          <li key={p.id}>
            <Link to={`/posts/${p.id}`}>{p.title} - {p.author}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
