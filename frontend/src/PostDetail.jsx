import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPost, summarizePost } from './api';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPost(id).then(setPost);
  }, [id]);

  const handleSummary = async () => {
    setLoading(true);
    const res = await summarizePost(id);
    setSummary(res.summary);
    setLoading(false);
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="post-card">
      <h2>{post.title}</h2>
      <p className="post-meta">{post.author} / {post.created_at}</p>
      <p>{post.content}</p>
      <button onClick={handleSummary} disabled={loading}>
        AI 요약 보기
      </button>
      {loading && <p>요약 중...</p>}
      {summary && <p><strong>요약:</strong> {summary}</p>}
    </div>
  );
}
