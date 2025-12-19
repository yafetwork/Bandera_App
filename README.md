# Bandera - Ethiopian Social Media Platform

A full-stack social media platform celebrating Ethiopian culture with user authentication, content sharing, and community features.

## Features

### 🎨 Cultural Focus
- Ethiopian-themed design with green, yellow, and red color scheme
- Cultural content categories: Food, Fashion, Music, Events, Landscapes
- Traditional Ethiopian imagery and iconography
- Cultural achievement system

### 🔐 User Authentication
- User registration and login with secure password hashing
- Session-based authentication with SQLite storage
- Profile management with cultural interests
- Password validation and security measures

### 📱 Social Media Features
- Photo sharing with cultural categorization
- Like and comment system
- User profiles with cultural achievements
- Story viewer with auto-advance
- Infinite scroll feed
- Content filtering by category

### 🛡️ Security & Performance
- Rate limiting to prevent abuse
- Helmet.js for security headers
- Input validation and sanitization
- File upload restrictions and validation
- CORS configuration

## Technology Stack

### Frontend
- HTML5 with Tailwind CSS
- Vanilla JavaScript (ES6+)
- Anime.js for animations
- Typed.js for text effects
- Splide.js for carousels
- ECharts.js for data visualization
- p5.js for creative coding

### Backend
- Node.js with Express.js
- SQLite3 database
- bcryptjs for password hashing
- express-session for session management
- Multer for file uploads
- Helmet.js for security
- CORS for cross-origin requests

## Project Structure

```
bandera/
├── index.html              # Main feed page
├── profile.html            # User profile page
├── explore.html            # Content discovery page
├── main.js                 # Frontend JavaScript
├── main-api.js             # API integration module
├── server.js               # Express server
├── init-db.js              # Database initialization
├── package.json            # Node.js dependencies
├── database.sqlite         # SQLite database (created after init)
├── resources/              # Static assets
│   ├── hero-community.png
│   ├── hero-content-creation.png
│   ├── hero-landscape.png
│   └── uploads/           # User uploaded images
├── interaction.md          # Interaction design doc
├── design.md              # Visual design guide
├── outline.md             # Project outline
└── README.md              # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### 1. Clone and Navigate
```bash
cd bandera
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Initialize Database
```bash
npm run init-db
```
This will:
- Create the SQLite database
- Set up all required tables
- Insert default cultural achievements
- Create an admin user (username: admin, password: admin123)

### 4. Start the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/me` - Get current user

### Posts
- `GET /api/posts` - Get posts (with category filter)
- `POST /api/posts` - Create new post (requires auth)
- `POST /api/posts/:id/like` - Like/unlike post

### Comments
- `GET /api/posts/:id/comments` - Get post comments
- `POST /api/posts/:id/comments` - Create comment (requires auth)

### Users & Profiles
- `GET /api/users/:username` - Get user profile
- `PUT /api/me` - Update current user (requires auth)

### Achievements
- `GET /api/achievements` - Get all achievements
- `GET /api/users/:id/achievements` - Get user achievements

## Default User

After database initialization, you can login with:
- **Username**: admin
- **Password**: admin123

## Development

### Running in Development Mode
```bash
npm run dev
```
This uses nodemon for automatic server restarts on file changes.

### Database Management
The SQLite database is stored in `database.sqlite`. You can inspect it using:
```bash
sqlite3 database.sqlite
```

### Adding New Features
1. Frontend: Modify HTML/CSS/JS files
2. Backend: Add new routes to `server.js`
3. Database: Update schema in `init-db.js`

## Security Features

- Password hashing with bcryptjs
- Session-based authentication
- Rate limiting on API endpoints
- CORS configuration
- Helmet.js security headers
- Input validation and sanitization
- File upload restrictions

## Cultural Content

The platform includes authentic Ethiopian cultural content:
- Traditional clothing (Habesha Kemis)
- Ethiopian cuisine (Injera, Doro Wat)
- Coffee ceremony traditions
- Cultural celebrations (Timkat)
- Traditional music instruments
- Ethiopian landscapes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open an issue on the project repository.

---

**Bandera** - Celebrating Ethiopian culture through community connection. 🇪🇹