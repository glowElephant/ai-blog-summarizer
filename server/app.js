const express = require('express');
const cors = require('cors');
const { summarizeText } = require('./utils');

function createApp(pool) {
  const app = express();
  app.use(cors());
  app.use(express.json());

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
      const summary = summarizeText(content);
      res.json({ summary });
    } catch (e) {
      res.status(500).json({ error: 'Summarization failed' });
    }
  });

  return app;
}

module.exports = { createApp };
