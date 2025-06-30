const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { summarize } = require('node-summary');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ai_blog'
});

async function init() {
  await pool.query(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY,
    title TEXT,
    author TEXT,
    created_at DATE,
    content TEXT
  )`);

  const count = await pool.query('SELECT COUNT(*) FROM posts');
  if (parseInt(count.rows[0].count) === 0) {
    const dataPath = path.join(__dirname, '..', 'sample-data.json');
    const posts = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    for (const p of posts) {
      await pool.query(
        'INSERT INTO posts(id, title, author, created_at, content) VALUES($1,$2,$3,$4,$5)',
        [p.id, p.title, p.author, p.created_at, p.content]
      );
    }
  }
}

app.get('/api/posts', async (req, res) => {
  const result = await pool.query('SELECT id, title, author, created_at FROM posts ORDER BY id');
  res.json(result.rows);
});

app.get('/api/posts/:id', async (req, res) => {
  const id = req.params.id;
  const result = await pool.query('SELECT * FROM posts WHERE id=$1', [id]);
  if (result.rows.length === 0) return res.status(404).send('Not found');
  res.json(result.rows[0]);
});

app.post('/api/posts/:id/summarize', async (req, res) => {
  const id = req.params.id;
  const result = await pool.query('SELECT content FROM posts WHERE id=$1', [id]);
  if (result.rows.length === 0) return res.status(404).send('Not found');

  const content = result.rows[0].content;
  try {
    const summary = await new Promise((resolve, reject) => {
      summarize('', content, (err, summary) => {
        if (err) reject(err);
        else resolve(summary.replace(/\n+/g, ' ').split(/(?<=\.)\s+/).slice(0,3).join(' '));
      });
    });
    res.json({ summary });
  } catch (e) {
    res.status(500).json({ error: 'Summarization failed' });
  }
});

const PORT = process.env.PORT || 3001;
init().then(() => {
  app.listen(PORT, () => console.log('Server running on', PORT));
});
