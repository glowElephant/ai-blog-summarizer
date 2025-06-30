const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const { createApp } = require('./app');

const connectionString =
  process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ai_blog';
const pool = new Pool({ connectionString });

async function init(poolInstance) {
  await poolInstance.query(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY,
    title TEXT,
    author TEXT,
    created_at DATE,
    content TEXT
  )`);

  const count = await poolInstance.query('SELECT COUNT(*) FROM posts');
  if (parseInt(count.rows[0].count) === 0) {
    const dataPath = path.join(__dirname, '..', 'sample-data.json');
    const posts = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    for (const p of posts) {
      await poolInstance.query(
        'INSERT INTO posts(id, title, author, created_at, content) VALUES($1,$2,$3,$4,$5)',
        [p.id, p.title, p.author, p.created_at, p.content]
      );
    }
  }
}

if (require.main === module) {
  const app = createApp(pool);
  const PORT = process.env.PORT || 3001;
  init(pool).then(() => {
    app.listen(PORT, () => console.log('Server running on', PORT));
  });
}

module.exports = { createApp, init, pool };
