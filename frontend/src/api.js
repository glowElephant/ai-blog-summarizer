const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

export async function fetchPosts() {
  const res = await fetch(`${API_BASE}/api/posts`);
  return res.json();
}

export async function fetchPost(id) {
  const res = await fetch(`${API_BASE}/api/posts/${id}`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
}

export async function summarizePost(id) {
  const res = await fetch(`${API_BASE}/api/posts/${id}/summarize`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}
