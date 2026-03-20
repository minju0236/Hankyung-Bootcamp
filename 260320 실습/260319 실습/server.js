const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'my_super_secret_key';

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
  queueLimit: 0
});

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: '토큰 없음' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: '토큰 오류' });
  }
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'signup.html'));
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: '값 입력' });
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
    'INSERT INTO users (user_id, password, user_name) VALUES (?, ?, ?)',
    [username, hashed, username]
);

    res.json({ message: '회원가입 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE user_id=?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: '로그인 실패' });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: '로그인 실패' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

app.get('/news', authMiddleware, async (req, res) => {
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

app.post('/news', authMiddleware, async (req, res) => {
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