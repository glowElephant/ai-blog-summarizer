import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PostsList from './PostsList';
import PostDetail from './PostDetail';

export default function App() {
  return (
    <BrowserRouter>
      <header>
        <h1>AI Blog Summarizer</h1>
      </header>
      <div className="container">
        <Routes>
          <Route path="/" element={<PostsList />} />
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
