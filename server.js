const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const multer = require('multer');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'database.sqlite');

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.tailwindcss.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net", "https://unpkg.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            connectSrc: ["'self'"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"]
        }
    }
}));

app.use(cors({
    origin: ['http://localhost:3000', 'https://w7sy3oukr7ca4.ok.kimi.link'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Session configuration
app.use(session({
    store: new SQLiteStore({
        dir: './',
        db: 'sessions.sqlite',
        table: 'sessions'
    }),
    secret: process.env.SESSION_SECRET || 'bandera-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use('/resources', express.static(path.join(__dirname, 'resources')));

// Database connection
const db = new sqlite3.Database(DB_PATH);

// File upload configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'resources/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueName = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'Authentication required' });
    }
}

// Routes

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/profile.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.html'));
});

app.get('/explore.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'explore.html'));
});

// API Routes

// User authentication routes
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password, fullName, bio, location } = req.body;
        
        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }
        
        // Check if user exists
        const existingUser = await new Promise((resolve, reject) => {
            db.get('SELECT id FROM users WHERE username = ? OR email = ?', [username, email], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
        
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        
        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);
        
        // Insert user
        const result = await new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO users (username, email, password_hash, full_name, bio, location, cultural_interests)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [
                username,
                email,
                passwordHash,
                fullName || null,
                bio || null,
                location || null,
                JSON.stringify(['Ethiopian Culture'])
            ], function(err) {
                if (err) reject(err);
                else resolve({ lastID: this.lastID });
            });
        });
        
        // Auto-login after registration
        req.session.userId = result.lastID;
        req.session.username = username;
        
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: result.lastID,
                username,
                email,
                fullName,
                bio,
                location
            }
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        
        // Find user
        const user = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        
        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        
        // Create session
        req.session.userId = user.id;
        req.session.username = user.username;
        
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.full_name,
                bio: user.bio,
                location: user.location,
                avatarUrl: user.avatar_url,
                culturalInterests: user.cultural_interests ? JSON.parse(user.cultural_interests) : []
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Could not log out' });
        }
        res.json({ message: 'Logout successful' });
    });
});

app.get('/api/me', requireAuth, async (req, res) => {
    try {
        const user = await new Promise((resolve, reject) => {
            db.get('SELECT id, username, email, full_name, bio, avatar_url, location, cultural_interests, created_at FROM users WHERE id = ?', 
                [req.session.userId], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
            ...user,
            culturalInterests: user.cultural_interests ? JSON.parse(user.cultural_interests) : []
        });
        
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Posts routes
app.get('/api/posts', async (req, res) => {
    try {
        const { category, limit = 20, offset = 0 } = req.query;
        
        let query = `
            SELECT p.*, u.username, u.avatar_url, u.full_name
            FROM posts p
            JOIN users u ON p.user_id = u.id
        `;
        
        const params = [];
        
        if (category && category !== 'all') {
            query += ' WHERE p.category = ?';
            params.push(category);
        }
        
        query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));
        
        const posts = await new Promise((resolve, reject) => {
            db.all(query, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        
        res.json({ posts });
        
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/posts', requireAuth, upload.single('image'), async (req, res) => {
    try {
        const { caption, category, location } = req.body;
        const imageUrl = req.file ? `/resources/uploads/${req.file.filename}` : null;
        
        if (!imageUrl) {
            return res.status(400).json({ error: 'Image is required' });
        }
        
        const result = await new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO posts (user_id, image_url, caption, category, location)
                VALUES (?, ?, ?, ?, ?)
            `, [req.session.userId, imageUrl, caption || null, category || null, location || null], function(err) {
                if (err) reject(err);
                else resolve({ lastID: this.lastID });
            });
        });
        
        const post = await new Promise((resolve, reject) => {
            db.get(`
                SELECT p.*, u.username, u.avatar_url, u.full_name
                FROM posts p
                JOIN users u ON p.user_id = u.id
                WHERE p.id = ?
            `, [result.lastID], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
        
        res.status(201).json({ post });
        
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Likes routes
app.post('/api/posts/:id/like', requireAuth, async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.session.userId;
        
        // Check if already liked
        const existingLike = await new Promise((resolve, reject) => {
            db.get('SELECT id FROM likes WHERE user_id = ? AND post_id = ?', [userId, postId], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
        
        if (existingLike) {
            // Unlike
            await new Promise((resolve, reject) => {
                db.run('DELETE FROM likes WHERE user_id = ? AND post_id = ?', [userId, postId], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            
            await new Promise((resolve, reject) => {
                db.run('UPDATE posts SET likes_count = likes_count - 1 WHERE id = ?', [postId], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            
            res.json({ liked: false });
        } else {
            // Like
            await new Promise((resolve, reject) => {
                db.run('INSERT INTO likes (user_id, post_id) VALUES (?, ?)', [userId, postId], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            
            await new Promise((resolve, reject) => {
                db.run('UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?', [postId], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            
            res.json({ liked: true });
        }
        
    } catch (error) {
        console.error('Like/unlike error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Comments routes
app.get('/api/posts/:id/comments', async (req, res) => {
    try {
        const postId = req.params.id;
        
        const comments = await new Promise((resolve, reject) => {
            db.all(`
                SELECT c.*, u.username, u.avatar_url, u.full_name
                FROM comments c
                JOIN users u ON c.user_id = u.id
                WHERE c.post_id = ?
                ORDER BY c.created_at ASC
            `, [postId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        
        res.json({ comments });
        
    } catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/posts/:id/comments', requireAuth, async (req, res) => {
    try {
        const postId = req.params.id;
        const { content } = req.body;
        
        if (!content || content.trim().length === 0) {
            return res.status(400).json({ error: 'Comment content is required' });
        }
        
        const result = await new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO comments (user_id, post_id, content)
                VALUES (?, ?, ?)
            `, [req.session.userId, postId, content.trim()], function(err) {
                if (err) reject(err);
                else resolve({ lastID: this.lastID });
            });
        });
        
        // Update post comments count
        await new Promise((resolve, reject) => {
            db.run('UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?', [postId], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        
        const comment = await new Promise((resolve, reject) => {
            db.get(`
                SELECT c.*, u.username, u.avatar_url, u.full_name
                FROM comments c
                JOIN users u ON c.user_id = u.id
                WHERE c.id = ?
            `, [result.lastID], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
        
        res.status(201).json({ comment });
        
    } catch (error) {
        console.error('Create comment error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Profile routes
app.get('/api/users/:username', async (req, res) => {
    try {
        const username = req.params.username;
        
        const user = await new Promise((resolve, reject) => {
            db.get(`
                SELECT id, username, email, full_name, bio, avatar_url, location, cultural_interests, created_at
                FROM users
                WHERE username = ?
            `, [username], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const posts = await new Promise((resolve, reject) => {
            db.all(`
                SELECT * FROM posts
                WHERE user_id = ?
                ORDER BY created_at DESC
            `, [user.id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        
        res.json({
            ...user,
            culturalInterests: user.cultural_interests ? JSON.parse(user.cultural_interests) : [],
            posts
        });
        
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Achievements routes
app.get('/api/achievements', async (req, res) => {
    try {
        const achievements = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM achievements ORDER BY category, name', (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        
        res.json({ achievements });
        
    } catch (error) {
        console.error('Get achievements error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/users/:id/achievements', async (req, res) => {
    try {
        const userId = req.params.id;
        
        const achievements = await new Promise((resolve, reject) => {
            db.all(`
                SELECT a.*, ua.earned_at
                FROM achievements a
                JOIN user_achievements ua ON a.id = ua.achievement_id
                WHERE ua.user_id = ?
                ORDER BY ua.earned_at DESC
            `, [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        
        res.json({ achievements });
        
    } catch (error) {
        console.error('Get user achievements error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        db.close(() => {
            console.log('Database connection closed');
            process.exit(0);
        });
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`🚀 Bandera server running on port ${PORT}`);
    console.log(`📱 Access the app at: http://localhost:${PORT}`);
    console.log('🔐 Authentication endpoints available at /api/register, /api/login, /api/logout');
});

module.exports = app;