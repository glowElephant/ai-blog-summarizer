import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PostsList from './PostsList';
import PostDetail from './PostDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PostsList />} />
        <Route path="/posts/:id" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
