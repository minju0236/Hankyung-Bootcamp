const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'static')));

const pool = mysql.createPool({
    host: 'localhost',
    user: 'testuser',
    password: '1234',
    database: 'testdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

// 기사 목록 조회
app.get('/news', async (req, res) => {
  try {
    const sql = `
      SELECT id, title, content, category, author, created_at
      FROM news
      ORDER BY id DESC
    `;

    const [rows] = await pool.query(sql);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});


// 기사 등록
app.post('/news', async (req, res) => {
  try {
    const { title, category, content, author } = req.body;

    if (!title || !category || !content || !author) {
      return res.status(400).json({ message: '모든 값을 입력해주세요' });
    }

    const sql = `
      INSERT INTO news (title, category, content, author)
      VALUES (?, ?, ?, ?)
    `;

    await pool.query(sql, [title, category, content, author]);

    res.json({ message: '기사 등록 완료' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

app.listen(PORT, () => {
  console.log(`서버 실행됨: http://localhost:${PORT}`);
});