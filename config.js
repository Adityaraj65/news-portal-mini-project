// Configuration for different environments
const config = {
    development: {
        API_BASE_URL: 'http://localhost:5000',
        GNEWS_API_BASE_URL: 'https://gnews.io/api/v4'
    },
    production: {
        API_BASE_URL: 'https://your-render-app.onrender.com', // Update this with your Render URL
        GNEWS_API_BASE_URL: 'https://gnews.io/api/v4'
    }
};

// Get current environment
const env = process.env.NODE_ENV || 'development';

// Export configuration based on environment
module.exports = {
    ...config[env],
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    GNEWS_API_KEY: process.env.GNEWS_API_KEY
};
