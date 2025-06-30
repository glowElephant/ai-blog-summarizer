const request = require('supertest');
const fs = require('fs');
const path = require('path');
const { createApp } = require('./app');
const { summarizeText } = require('./utils');

class FakePool {
  constructor() {
    this.posts = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'sample-data.json'), 'utf-8')
    );
  }

  async query(sql, params) {
    if (sql.startsWith('SELECT id, title, author, created_at FROM posts')) {
      return {
        rows: this.posts.map(({ id, title, author, created_at }) => ({
          id,
          title,
          author,
          created_at,
        })),
      };
    }

    if (sql.startsWith('SELECT * FROM posts WHERE id=$1')) {
      const post = this.posts.find((p) => p.id === Number(params[0]));
      return { rows: post ? [post] : [] };
    }

    if (sql.startsWith('SELECT content FROM posts WHERE id=$1')) {
      const post = this.posts.find((p) => p.id === Number(params[0]));
      return { rows: post ? [{ content: post.content }] : [] };
    }

    throw new Error('Unexpected query: ' + sql);
  }
}

describe('API routes', () => {
  let app;
  let data;

  beforeAll(() => {
    data = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'sample-data.json'), 'utf-8')
    );
    app = createApp(new FakePool());
  });

  test('GET /api/posts returns basic info', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    const expected = data.map((p) => ({
      id: p.id,
      title: p.title,
      author: p.author,
      created_at: p.created_at,
    }));
    expect(res.body).toEqual(expected);
  });

  test('GET /api/posts/:id returns full post', async () => {
    const post = data[0];
    const res = await request(app).get(`/api/posts/${post.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(post);
  });

  test('POST /api/posts/:id/summarize returns summary', async () => {
    const post = data[0];
    const res = await request(app).post(`/api/posts/${post.id}/summarize`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ summary: summarizeText(post.content) });
  });
});
