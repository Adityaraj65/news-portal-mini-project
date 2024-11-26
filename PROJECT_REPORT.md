# News Portal Project Report

## Project Overview
A modern, responsive news portal web application built with vanilla JavaScript and Node.js. The application focuses on delivering news content with a clean user interface and robust user authentication.

## Technical Stack

### Frontend
- **HTML5**: Semantic markup for better accessibility and SEO
- **CSS3**: Modern styling with flexbox and grid layouts
- **JavaScript**: Vanilla JS for DOM manipulation and API interactions
- **Features**:
  - Responsive design
  - Dark/Light theme toggle
  - Multi-language support
  - Clean and intuitive UI

### Backend
- **Node.js**: Server runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for user data
- **Features**:
  - RESTful API architecture
  - JWT-based authentication
  - Secure password hashing
  - Input validation and error handling

## Core Features

### 1. User Authentication
- Secure signup and login system
- JWT (JSON Web Token) based session management
- Password hashing using bcrypt
- Input validation and error handling
- Persistent user sessions using localStorage

### 2. News Display
- Dynamic news fetching from GNews API
- Responsive grid layout for news articles
- Category-based filtering
- Article preview with images
- "Read More" links to full articles

### 3. Customization Features
- Theme switching (Dark/Light mode)
- Language selection (Multiple languages supported)
- Reading mode for better readability
- Persistent user preferences

## Implementation Details

### Authentication System
```javascript
// Server-side JWT authentication
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) throw new Error();
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

// Client-side authentication state management
function updateAuthUI() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (token && user) {
        // Show logged-in state
        showUserProfile(user);
    } else {
        // Show login/signup buttons
        showAuthButtons();
    }
}
```

### News Fetching and Display
```javascript
async function fetchNews(category = '', lang = currentLang) {
    try {
        const endpoint = `${GNEWS_API_BASE_URL}/top-headlines?${new URLSearchParams({
            category: category || 'general',
            lang: lang,
            apikey: GNEWS_API_KEY,
            max: 10
        })}`;
        const response = await fetch(endpoint);
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.error('Error fetching news:', error);
        showErrorMessage(translations[currentLang].error);
        return [];
    }
}
```

### Theme Management
```javascript
function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
}
```

## User Experience Enhancements
- Responsive design for all screen sizes
- Reading mode for enhanced readability
  - Warm, sepia-toned color scheme
  - Optimized typography with Georgia font
  - Increased line height and spacing
  - User preference persistence

## Multilingual Support
The application supports two languages:
- English (Default)
- Hindi (हिंदी)

Language selection is persistent across sessions using localStorage, and the application defaults to English if the user's browser language is not supported.

## Security Measures

1. **Password Security**
   - Passwords are hashed using bcrypt
   - Salt rounds configured for optimal security
   - No plaintext passwords stored

2. **Authentication Security**
   - JWT tokens for stateless authentication
   - Secure token storage in localStorage
   - Token expiration and validation
   - Protected API endpoints

3. **Input Validation**
   - Server-side validation for all inputs
   - Sanitization of user inputs
   - Proper error handling and messages

4. **Error Handling**
   - Comprehensive error catching
   - User-friendly error messages
   - Detailed server-side logging
   - Proper HTTP status codes

## Database Schema

### User Model
```javascript
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
```

## API Endpoints

### Authentication Endpoints
- `POST /api/signup`: User registration
  - Required fields: name, email, password
  - Returns: JWT token
- `POST /api/login`: User login
  - Required fields: email, password
  - Returns: JWT token

## Performance Optimizations

1. **Frontend Optimizations**
   - Efficient DOM manipulation
   - Event delegation for dynamic elements
   - Debounced event handlers
   - Cached DOM queries

2. **Backend Optimizations**
   - Database indexing
   - Efficient error handling
   - Proper HTTP status codes
   - Input validation at entry points

## Future Enhancements

1. **Feature Additions**
   - User profile customization
   - News article bookmarking
   - Advanced search functionality
   - Email verification system

2. **Technical Improvements**
   - Implement rate limiting
   - Add request caching
   - Implement refresh tokens
   - Add OAuth integration

## Challenges and Solutions

1. **Authentication Flow**
   - Challenge: Managing user state across page refreshes
   - Solution: Implemented localStorage-based token persistence with proper validation

2. **Error Handling**
   - Challenge: Providing user-friendly error messages
   - Solution: Implemented centralized error handling with translated messages

3. **User Experience**
   - Challenge: Maintaining UI state during theme/language changes
   - Solution: Implemented persistent settings using localStorage

## Testing

### Manual Testing Checklist
- [x] User registration with validation
- [x] User login with proper error handling
- [x] Theme switching persistence
- [x] Language switching functionality
- [x] News fetching and display
- [x] Responsive design across devices
- [x] Error message display
- [x] Token persistence
- [x] Logout functionality

## Conclusion
The News Portal project demonstrates a robust implementation of a modern web application with a focus on user experience and security. The application successfully combines frontend interactivity with secure backend operations, providing a solid foundation for future enhancements.
