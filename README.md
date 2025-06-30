# ai-blog-summarizer

This prototype showcases a small blog system that stores posts in PostgreSQL and provides an AI generated summary of each post.

## Setup

1. Install dependencies in the root and frontend directories.
   ```bash
   npm install
   cd frontend && npm install
   ```
2. Ensure PostgreSQL is running and accessible via `postgresql://postgres:postgres@localhost:5432/ai_blog` or set `DATABASE_URL`.
3. Start the API server:
   ```bash
   npm start
   ```
4. In another terminal, start the frontend dev server:
   ```bash
   cd frontend && npm run dev
   ```

The app will be available on `http://localhost:5173` and expects the API on port `3001`.
