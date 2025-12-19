const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

// Database file path
const DB_PATH = path.join(__dirname, 'database.sqlite');

// Initialize database
const db = new sqlite3.Database(DB_PATH);

// Create tables
function createTables() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Users table
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    full_name TEXT,
                    bio TEXT,
                    avatar_url TEXT,
                    location TEXT,
                    languages TEXT,
                    cultural_interests TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Posts table
            db.run(`
                CREATE TABLE IF NOT EXISTS posts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    image_url TEXT NOT NULL,
                    caption TEXT,
                    category TEXT,
                    location TEXT,
                    likes_count INTEGER DEFAULT 0,
                    comments_count INTEGER DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )
            `);

            // Likes table
            db.run(`
                CREATE TABLE IF NOT EXISTS likes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    post_id INTEGER NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id),
                    FOREIGN KEY (post_id) REFERENCES posts (id),
                    UNIQUE(user_id, post_id)
                )
            `);

            // Comments table
            db.run(`
                CREATE TABLE IF NOT EXISTS comments (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    post_id INTEGER NOT NULL,
                    content TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id),
                    FOREIGN KEY (post_id) REFERENCES posts (id)
                )
            `);

            // Followers table
            db.run(`
                CREATE TABLE IF NOT EXISTS followers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    follower_id INTEGER NOT NULL,
                    following_id INTEGER NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (follower_id) REFERENCES users (id),
                    FOREIGN KEY (following_id) REFERENCES users (id),
                    UNIQUE(follower_id, following_id)
                )
            `);

            // Cultural achievements table
            db.run(`
                CREATE TABLE IF NOT EXISTS achievements (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    description TEXT,
                    icon TEXT,
                    category TEXT,
                    requirement_type TEXT,
                    requirement_value INTEGER,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // User achievements table
            db.run(`
                CREATE TABLE IF NOT EXISTS user_achievements (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    achievement_id INTEGER NOT NULL,
                    earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id),
                    FOREIGN KEY (achievement_id) REFERENCES achievements (id)
                )
            `);

            console.log('Database tables created successfully!');
            resolve();
        });
    });
}

// Insert default achievements
function insertDefaultAchievements() {
    return new Promise((resolve, reject) => {
        const achievements = [
            { name: 'Coffee Master', description: 'Share 10 coffee-related posts', icon: '☕', category: 'food', requirement_type: 'posts', requirement_value: 10 },
            { name: 'Fashion Icon', description: 'Share 15 fashion posts', icon: '👗', category: 'fashion', requirement_type: 'posts', requirement_value: 15 },
            { name: 'Chef', description: 'Share 20 food posts', icon: '🍽️', category: 'food', requirement_type: 'posts', requirement_value: 20 },
            { name: 'Storyteller', description: 'Share 25 cultural stories', icon: '📚', category: 'culture', requirement_type: 'posts', requirement_value: 25 },
            { name: 'Music Lover', description: 'Share 12 music posts', icon: '🎵', category: 'music', requirement_type: 'posts', requirement_value: 12 },
            { name: 'Explorer', description: 'Share 18 landscape posts', icon: '🏔️', category: 'landscapes', requirement_type: 'posts', requirement_value: 18 },
            { name: 'Community Builder', description: 'Get 100 followers', icon: '🤝', category: 'social', requirement_type: 'followers', requirement_value: 100 },
            { name: 'Cultural Ambassador', description: 'Get 500 likes on a post', icon: '🏆', category: 'social', requirement_type: 'likes', requirement_value: 500 }
        ];

        const stmt = db.prepare(`
            INSERT INTO achievements (name, description, icon, category, requirement_type, requirement_value)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        let completed = 0;
        achievements.forEach(achievement => {
            stmt.run([
                achievement.name,
                achievement.description,
                achievement.icon,
                achievement.category,
                achievement.requirement_type,
                achievement.requirement_value
            ], function(err) {
                if (err && err.code !== 'SQLITE_CONSTRAINT') {
                    console.error('Error inserting achievement:', err);
                }
                completed++;
                if (completed === achievements.length) {
                    stmt.finalize();
                    console.log('Default achievements inserted!');
                    resolve();
                }
            });
        });
    });
}

// Create admin user
async function createAdminUser() {
    return new Promise((resolve, reject) => {
        const adminPassword = 'admin123'; // In production, use a secure password
        const hashedPassword = bcrypt.hashSync(adminPassword, 10);

        db.run(`
            INSERT OR IGNORE INTO users (username, email, password_hash, full_name, bio, location, cultural_interests)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            'admin',
            'admin@bandera.com',
            hashedPassword,
            'Bandera Administrator',
            'Administrator of the Bandera Ethiopian social platform',
            'Addis Ababa, Ethiopia',
            JSON.stringify(['administration', 'community management', 'cultural preservation'])
        ], function(err) {
            if (err && err.code !== 'SQLITE_CONSTRAINT') {
                console.error('Error creating admin user:', err);
                reject(err);
            } else {
                console.log('Admin user created/verified!');
                resolve();
            }
        });
    });
}

// Main initialization
async function initializeDatabase() {
    try {
        console.log('Initializing Bandera database...');
        
        await createTables();
        await insertDefaultAchievements();
        await createAdminUser();
        
        console.log('Database initialization completed successfully!');
        console.log('Admin credentials: username: admin, password: admin123');
        
        db.close();
    } catch (error) {
        console.error('Database initialization failed:', error);
        db.close();
        process.exit(1);
    }
}

// Run initialization
initializeDatabase();