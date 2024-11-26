# News Portal

A modern news portal web application built with vanilla JavaScript, Node.js, and MongoDB.

## Features

- 🔐 User Authentication
  - Secure signup and login
  - JWT-based session management
  - Password hashing

- 📰 News Display
  - Dynamic news fetching
  - Category filtering
  - Responsive layout
  - Multiple languages

- 🎨 Customization
  - Dark/Light theme
  - Reading mode
  - Language selection
  - Persistent preferences

- 📰 Real-time news updates via GNews API
- 🌐 Multilingual support (English & Hindi)
- 🔐 Secure user authentication
- 👀 Eye-friendly reading mode
- 📱 Responsive design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- Modern web browser

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/newsportal.git
cd newsportal
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/newsportal
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

4. Start MongoDB:
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo service mongod start
```

5. Start the application:
```bash
npm start
```

6. Open `http://localhost:5000` in your browser

## Project Structure

```
newsportal/
├── public/          # Static files
├── server.js        # Express server and API routes
├── news.html        # Main frontend page
├── news.js         # Frontend JavaScript
├── news.css        # Styles
├── .env            # Environment variables
└── package.json    # Dependencies
```

## API Endpoints

### Authentication
- `POST /api/signup`
  - Register new user
  - Body: `{ name, email, password }`

- `POST /api/login`
  - Login user
  - Body: `{ email, password }`

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 5000)

## Usage

### Reading Mode
Toggle reading mode by clicking the book reader icon (📚) in the navigation bar. Reading mode provides:
- Warm, eye-friendly color scheme
- Optimized typography for better readability
- Increased spacing and line height
- Automatic preference saving

## Development

1. Install development dependencies:
```bash
npm install --save-dev nodemon
```

2. Start development server:
```bash
npm run dev
```

## Testing

1. Open `test.html` in your browser to test API endpoints
2. Use the testing interface to:
   - Test user registration
   - Test user login
   - Verify authentication

## Troubleshooting

### Common Issues

1. MongoDB Connection Error
```bash
# Check if MongoDB is running
net start MongoDB  # Windows
sudo service mongod status  # Linux/Mac
```

2. Port Already in Use
```bash
# Find and kill process using port 5000
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Linux/Mac
```

3. JWT Token Issues
- Clear browser localStorage
- Check JWT_SECRET in .env
- Verify token expiration

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- GNews API for news content
- MongoDB for database
- Express.js team
- JWT.io

## Quick Deployment

### Free Hosting Options 🚀

1. **Backend**: Deploy on [Render](https://render.com) (Free tier)
   ```bash
   # Push your code to GitHub
   git push origin main
   
   # Connect to Render
   # Set environment variables in Render dashboard
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GNEWS_API_KEY=your_gnews_api_key
   ```

2. **Frontend**: Deploy on GitHub Pages
   - Push code to GitHub
   - Enable GitHub Pages in repository settings
   - Update API URL in `news.js`

3. **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier)
   - Create free cluster
   - Get connection string
   - Add to Render environment variables

Detailed deployment instructions available in [DOCUMENTATION.md](./DOCUMENTATION.md#deployment-guide)
