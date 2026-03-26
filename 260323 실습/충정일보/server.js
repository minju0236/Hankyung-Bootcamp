
const express = require('express');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'my_super_secret_key';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDir = path.join(__dirname, 'uploads');
const staticDir = path.join(__dirname, 'static');
const cssDir = path.join(staticDir, 'css');
const imagesDir = path.join(staticDir, 'images');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(staticDir)) fs.mkdirSync(staticDir);
if (!fs.existsSync(cssDir)) fs.mkdirSync(cssDir);
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);

app.use('/uploads', express.static(uploadDir));
app.use('/static', express.static(staticDir));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const fileName = Date.now() + '_' + Math.round(Math.random() * 1e9) + ext;
        cb(null, fileName);
    }
});
const upload = multer({ storage });

const pool = mysql.createPool({
    host: 'localhost',
    user: 'testuser',
    password: '1234',
    database: 'testdb'
});

function getUserFromToken(req) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return null;

    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
}

// 페이지 라우팅
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'templates', 'login.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'templates', 'signup.html')));
app.get('/main', (req, res) => res.sendFile(path.join(__dirname, 'templates', 'main.html')));
app.get('/subscriber', (req, res) => res.sendFile(path.join(__dirname, 'templates', 'subscriber.html')));
app.get('/reporter', (req, res) => res.sendFile(path.join(__dirname, 'templates', 'reporter.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'templates', 'admin.html')));
app.get('/article', (req, res) => res.sendFile(path.join(__dirname, 'templates', 'article.html')));

// 회원가입
app.post('/api/signup', async (req, res) => {
    try {
        const { userId, password, userName, role } = req.body;

        if (!userId || !password || !userName || !role) {
            return res.status(400).json({ success: false, message: '입력값 누락' });
        }

        if (!['subscriber', 'reporter', 'admin'].includes(role)) {
            return res.status(400).json({ success: false, message: '역할 오류' });
        }

        const hashed = await bcrypt.hash(password, 10);

        await pool.execute(
            'INSERT INTO users (user_id, password, user_name, role) VALUES (?, ?, ?, ?)',
            [userId, hashed, userName, role]
        );

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '회원가입 실패' });
    }
});

// 로그인
app.post('/api/login', async (req, res) => {
    try {
        const { userId, password } = req.body;
        const [rows] = await pool.execute('SELECT * FROM users WHERE user_id = ?', [userId]);
        const user = rows[0];

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                {
                    id: user.id,
                    userId: user.user_id,
                    userName: user.user_name,
                    role: user.role
                },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({ success: true, token });
        } else {
            res.status(401).json({ success: false, message: '로그인 실패' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});

// JWT 검증
app.get('/api/verify', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.json({ success: false });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.json({ success: false });
        res.json({ success: true, user: decoded });
    });
});

// 구독자용 기사 조회: published만 노출, 검색 포함
app.get('/api/data', async (req, res) => {
    try {
        const search = req.query.search ? req.query.search.trim() : '';
        let sql = `
            SELECT id, title, content, article_date, category, reporter_name, photo_path, status, created_at
            FROM articles
            WHERE status = 'published'
        `;
        const params = [];

        if (search) {
            sql += ` AND (title LIKE ? OR content LIKE ? OR reporter_name LIKE ? OR category LIKE ?)`;
            const keyword = `%${search}%`;
            params.push(keyword, keyword, keyword, keyword);
        }

        sql += ` ORDER BY id DESC`;

        const [rows] = await pool.execute(sql, params);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json([]);
    }
});

// 기사 상세
app.get('/api/article/:id', async (req, res) => {
    try {
        const user = getUserFromToken(req);

        const [rows] = await pool.execute(`
            SELECT id, title, content, article_date, category, reporter_id, reporter_name, photo_path, status, created_at
            FROM articles
            WHERE id = ?
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false });
        }

        const article = rows[0];

        if (article.status !== 'published') {
            if (!user) {
                return res.status(403).json({ success: false, message: '미출판 기사입니다.' });
            }

            const canRead =
                user.role === 'admin' ||
                (user.role === 'reporter' && user.id === article.reporter_id);

            if (!canRead) {
                return res.status(403).json({ success: false, message: '미출판 기사입니다.' });
            }
        }

        res.json({ success: true, article });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

// 기자 기사 등록
app.post('/api/reporter/article', upload.single('photo'), async (req, res) => {
    try {
        const user = getUserFromToken(req);
        if (!user) return res.status(401).json({ success: false, message: '인증 실패' });
        if (user.role !== 'reporter') return res.status(403).json({ success: false, message: '기자 전용 기능' });

        const { title, content, articleDate, category } = req.body;
        const photoPath = req.file ? '/uploads/' + req.file.filename : '/static/images/default-photo.svg';

        await pool.execute(`
            INSERT INTO articles (title, content, article_date, category, reporter_id, reporter_name, photo_path, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
        `, [title, content, articleDate, category, user.id, user.userName, photoPath]);

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '기사 등록 실패' });
    }
});

// 기자 본인 기사 조회 + 검색
app.get('/api/reporter/my-articles', async (req, res) => {
    try {
        const user = getUserFromToken(req);
        if (!user) return res.status(401).json([]);
        if (user.role !== 'reporter') return res.status(403).json([]);

        const search = req.query.search ? req.query.search.trim() : '';
        let sql = `
            SELECT id, title, content, article_date, category, reporter_name, photo_path, status, created_at
            FROM articles
            WHERE reporter_id = ?
        `;
        const params = [user.id];

        if (search) {
            sql += ` AND (title LIKE ? OR content LIKE ? OR category LIKE ?)`;
            const keyword = `%${search}%`;
            params.push(keyword, keyword, keyword);
        }

        sql += ` ORDER BY id DESC`;

        const [rows] = await pool.execute(sql, params);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json([]);
    }
});

// 기자 기사 수정
app.put('/api/reporter/article/:id', upload.single('photo'), async (req, res) => {
    try {
        const user = getUserFromToken(req);
        if (!user) return res.status(401).json({ success: false });
        if (user.role !== 'reporter') return res.status(403).json({ success: false });

        const articleId = req.params.id;
        const { title, content, articleDate, category } = req.body;

        const [rows] = await pool.execute(
            'SELECT * FROM articles WHERE id = ? AND reporter_id = ?',
            [articleId, user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: '기사 없음' });
        }

        const article = rows[0];
        const photoPath = req.file ? '/uploads/' + req.file.filename : article.photo_path;

        await pool.execute(`
            UPDATE articles
            SET title = ?, content = ?, article_date = ?, category = ?, photo_path = ?, status = 'pending'
            WHERE id = ? AND reporter_id = ?
        `, [title, content, articleDate, category, photoPath, articleId, user.id]);

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

// 기자 기사 삭제
app.delete('/api/reporter/article/:id', async (req, res) => {
    try {
        const user = getUserFromToken(req);
        if (!user) return res.status(401).json({ success: false });
        if (user.role !== 'reporter') return res.status(403).json({ success: false });

        await pool.execute(
            'DELETE FROM articles WHERE id = ? AND reporter_id = ?',
            [req.params.id, user.id]
        );

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

// 관리자 사용자 조회
app.get('/api/admin/users', async (req, res) => {
    try {
        const user = getUserFromToken(req);
        if (!user) return res.status(401).json([]);
        if (user.role !== 'admin') return res.status(403).json([]);

        const [rows] = await pool.execute(`
            SELECT id, user_id, user_name, role
            FROM users
            ORDER BY id DESC
        `);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json([]);
    }
});

// 관리자 사용자 삭제
app.delete('/api/admin/users/:id', async (req, res) => {
    try {
        const user = getUserFromToken(req);
        if (!user) return res.status(401).json({ success: false });
        if (user.role !== 'admin') return res.status(403).json({ success: false });

        await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

// 관리자 아이디 수정
app.put('/api/admin/users/:id/userid', async (req, res) => {
    try {
        const user = getUserFromToken(req);
        if (!user) return res.status(401).json({ success: false });
        if (user.role !== 'admin') return res.status(403).json({ success: false });

        const { userId } = req.body;
        await pool.execute('UPDATE users SET user_id = ? WHERE id = ?', [userId, req.params.id]);

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

// 관리자 비밀번호 수정
app.put('/api/admin/users/:id/password', async (req, res) => {
    try {
        const user = getUserFromToken(req);
        if (!user) return res.status(401).json({ success: false });
        if (user.role !== 'admin') return res.status(403).json({ success: false });

        const { password } = req.body;
        const hashed = await bcrypt.hash(password, 10);

        await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashed, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

// 관리자 기사 목록 조회 + 검색
app.get('/api/admin/articles', async (req, res) => {
    try {
        const user = getUserFromToken(req);
        if (!user) return res.status(401).json([]);
        if (user.role !== 'admin') return res.status(403).json([]);

        const search = req.query.search ? req.query.search.trim() : '';
        let sql = `
            SELECT id, title, content, article_date, category, reporter_name, photo_path, status, created_at
            FROM articles
            WHERE 1=1
        `;
        const params = [];

        if (search) {
            sql += ` AND (title LIKE ? OR content LIKE ? OR reporter_name LIKE ? OR category LIKE ? OR status LIKE ?)`;
            const keyword = `%${search}%`;
            params.push(keyword, keyword, keyword, keyword, keyword);
        }

        sql += ` ORDER BY id DESC`;

        const [rows] = await pool.execute(sql, params);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json([]);
    }
});

// 관리자 승인
app.put('/api/admin/articles/:id/publish', async (req, res) => {
    try {
        const user = getUserFromToken(req);
        if (!user) return res.status(401).json({ success: false });
        if (user.role !== 'admin') return res.status(403).json({ success: false });

        await pool.execute(
            "UPDATE articles SET status = 'published' WHERE id = ?",
            [req.params.id]
        );

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

// 관리자 반려
app.put('/api/admin/articles/:id/reject', async (req, res) => {
    try {
        const user = getUserFromToken(req);
        if (!user) return res.status(401).json({ success: false });
        if (user.role !== 'admin') return res.status(403).json({ success: false });

        await pool.execute(
            "UPDATE articles SET status = 'rejected' WHERE id = ?",
            [req.params.id]
        );

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

// 댓글 조회
app.get('/api/article/:id/comments', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT id, user_id, user_name, content, created_at
            FROM comments
            WHERE article_id = ?
            ORDER BY id DESC
        `, [req.params.id]);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json([]);
    }
});

// 댓글 등록
app.post('/api/article/:id/comments', async (req, res) => {
    try {
        const user = getUserFromToken(req);
        if (!user) return res.status(401).json({ success: false, message: '로그인 필요' });

        const { content } = req.body;
        if (!content || !content.trim()) {
            return res.status(400).json({ success: false, message: '댓글 내용 없음' });
        }

        const [rows] = await pool.execute(`
            SELECT id, status
            FROM articles
            WHERE id = ?
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false });
        }

        if (rows[0].status !== 'published') {
            return res.status(403).json({ success: false, message: '출판 기사만 댓글 가능' });
        }

        await pool.execute(`
            INSERT INTO comments (article_id, user_id, user_name, content)
            VALUES (?, ?, ?, ?)
        `, [req.params.id, user.id, user.userName, content.trim()]);

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

// 댓글 삭제: 관리자 또는 작성자
app.delete('/api/comments/:id', async (req, res) => {
    try {
        const user = getUserFromToken(req);
        if (!user) return res.status(401).json({ success: false });

        const [rows] = await pool.execute(
            'SELECT * FROM comments WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false });
        }

        const comment = rows[0];
        const canDelete = user.role === 'admin' || user.id === comment.user_id;

        if (!canDelete) {
            return res.status(403).json({ success: false });
        }

        await pool.execute('DELETE FROM comments WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

app.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}`));
