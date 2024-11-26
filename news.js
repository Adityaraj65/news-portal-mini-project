// API Configuration
const GNEWS_API_BASE_URL = 'https://gnews.io/api/v4';
const GNEWS_API_KEY = "dd2d5dd6dbd3c56b95e6badfceadf32";

// Error handling for API requests
async function handleApiError(response) {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch news');
    }
    return response;
}

// Fetch news with better error handling and rate limit consideration
async function fetchNews(category = '', lang = currentLang) {
    try {
        const endpoint = `${GNEWS_API_BASE_URL}/top-headlines?${new URLSearchParams({
            category: category || 'general',
            lang: lang,
            apikey: GNEWS_API_KEY,
            max: 10 // Limit articles to conserve API calls
        })}`;

        const response = await fetch(endpoint);
        await handleApiError(response);
        const data = await response.json();
        
        if (!data.articles || !Array.isArray(data.articles)) {
            throw new Error('Invalid response format');
        }

        return data.articles;
    } catch (error) {
        console.error('Error fetching news:', error);
        showErrorMessage(translations[currentLang].error);
        return [];
    }
}

// Show error message to user
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.querySelector('main').prepend(errorDiv);
    
    // Remove error message after 5 seconds
    setTimeout(() => errorDiv.remove(), 5000);
}

// User Authentication State
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Language Support
const translations = {
    en: {
        home: 'Home',
        politics: 'Politics',
        technology: 'Technology',
        sports: 'Sports',
        entertainment: 'Entertainment',
        login: 'Login',
        signup: 'Sign Up',
        logout: 'Logout',
        readMore: 'Read More',
        featured: 'Featured News',
        latest: 'Latest News',
        error: 'Error loading news',
        welcome: 'Welcome',
        emailPlaceholder: 'Enter your email',
        passwordPlaceholder: 'Enter your password',
        namePlaceholder: 'Enter your name'
    },
    hi: {
        home: 'होम',
        politics: 'राजनीति',
        technology: 'तकनीक',
        sports: 'खेल',
        entertainment: 'मनोरंजन',
        login: 'लॉग इन',
        signup: 'साइन अप',
        logout: 'लॉग आउट',
        readMore: 'और पढ़ें',
        featured: 'प्रमुख समाचार',
        latest: 'ताज़ा खबरें',
        error: 'समाचार लोड करने में त्रुटि',
        welcome: 'स्वागत है',
        emailPlaceholder: 'अपना ईमेल दर्ज करें',
        passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
        namePlaceholder: 'अपना नाम दर्ज करें'
    }
};

// Set initial language from localStorage or browser preference
let currentLang = localStorage.getItem('language') || navigator.language.split('-')[0] || 'en';
if (!translations[currentLang]) currentLang = 'en';

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    changeLanguage(currentLang);
    document.getElementById('languageSelect').value = currentLang;
});

function changeLanguage(lang) {
    if (!translations[lang]) return;
    
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    // Update all elements with data-lang attribute
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[lang][key]) {
            if (element.tagName === 'INPUT') {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update news content language if using GNews API
    fetchNews(currentCategory, lang);
}

// Update UI based on authentication state
function updateAuthUI() {
    const authButtons = document.querySelector('.auth-buttons');
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (token && user) {
        authButtons.innerHTML = `
            <span class="user-email">${user.email}</span>
            <button onclick="logout()">Logout</button>
        `;
    } else {
        authButtons.innerHTML = `
            <button onclick="openModal('login')" data-lang="login">Login</button>
            <button onclick="openModal('signup')" data-lang="signup">Sign Up</button>
        `;
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    currentUser = null;
    updateAuthUI();
    showSuccessMessage('Successfully logged out!');
}

// Form submission handlers
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = this.querySelector('input[name="username"]').value;
    const password = this.querySelector('input[name="password"]').value;

    try {
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        // Store token
        localStorage.setItem('token', data.token);
        currentUser = { email };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Close modal and update UI
        closeModal('login');
        updateAuthUI();
        showSuccessMessage('Successfully logged in!');
    } catch (error) {
        showErrorMessage(error.message);
    }
});

document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = this.querySelector('input[name="email"]').value;
    const password = this.querySelector('input[name="password"]').value;
    const name = this.querySelector('input[name="name"]').value;

    try {
        const response = await fetch('http://localhost:5000/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, name })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Signup failed');
        }

        // Store token
        localStorage.setItem('token', data.token);
        currentUser = { email, name };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Close modal and update UI
        closeModal('signup');
        updateAuthUI();
        showSuccessMessage('Successfully signed up!');
    } catch (error) {
        showErrorMessage(error.message);
    }
});

// Authentication functions
function openModal(type) {
    document.getElementById(`${type}Modal`).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(type) {
    document.getElementById(`${type}Modal`).classList.remove('active');
    document.body.style.overflow = 'auto';
}

function switchModal(type) {
    const currentType = type === 'login' ? 'signup' : 'login';
    closeModal(currentType);
    setTimeout(() => openModal(type), 100);
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Function to create news cards
function createNewsCard(article) {
    return `
        <div class="news-card">
            <img src="${article.image || 'https://via.placeholder.com/300x200'}" alt="${article.title}">
            <div class="news-content">
                <span class="category">${article.source.name}</span>
                <h3>${article.title}</h3>
                <p>${article.description || ''}</p>
                <div class="news-footer">
                    <span class="date">${new Date(article.publishedAt).toLocaleDateString()}</span>
                    <a href="${article.url}" target="_blank" class="read-more">Read Full Article</a>
                    <button onclick="shareArticle('${article.title}', '${article.url}')" class="share-btn">
                        <i class="fas fa-share"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Create news item HTML
function createNewsItem(article) {
    return `
        <div class="news-item">
            <h4>${article.title}</h4>
            <p>${article.description || ''}</p>
            <div class="news-footer">
                <span class="date">${new Date(article.publishedAt).toLocaleDateString(currentLang)}</span>
                <a href="${article.url}" target="_blank">${translations[currentLang].readMore}</a>
                <button onclick="shareArticle('${article.title}', '${article.url}')" class="share-btn">
                    <i class="fas fa-share"></i>
                </button>
            </div>
        </div>
    `;
}

// Share article
function shareArticle(title, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).catch(console.error);
    } else {
        // Fallback for browsers that don't support Web Share API
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = url;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        alert('Link copied to clipboard!');
    }
}

// Category navigation
const categoryMap = {
    'home': '',
    'general': 'general',
    'technology': 'technology',
    'sports': 'sports',
    'entertainment': 'entertainment',
    'business': 'business',
    'science': 'science',
    'health': 'health'
};

document.querySelectorAll('.nav-items a').forEach(link => {
    link.addEventListener('click', async (e) => {
        e.preventDefault();
        const category = e.target.textContent.toLowerCase();
        const mappedCategory = categoryMap[category] || '';
        
        // Show loading state
        const newsGrid = document.querySelector('.news-grid');
        newsGrid.innerHTML = '<div class="loading">Loading news...</div>';
        
        try {
            const articles = await fetchNews(mappedCategory);
            newsGrid.innerHTML = articles
                .slice(0, 6)
                .map(createNewsCard)
                .join('');
        } catch (error) {
            console.error('Error:', error);
            newsGrid.innerHTML = '<div class="error">Failed to load news</div>';
        }
    });
});

// Function to populate news with loading states and error handling
async function populateNews() {
    const featuredNews = document.querySelector('.news-grid');
    const latestNews = document.querySelector('.news-list');
    
    featuredNews.innerHTML = `<div class="loading">${translations[currentLang].loading}</div>`;
    latestNews.innerHTML = `<div class="loading">${translations[currentLang].loading}</div>`;
    
    try {
        // Fetch featured news (technology category)
        const featuredArticles = await fetchNews('technology');
        if (featuredArticles.length > 0) {
            featuredNews.innerHTML = featuredArticles
                .slice(0, 3)
                .map(createNewsCard)
                .join('');
        } else {
            featuredNews.innerHTML = `<div class="error">${translations[currentLang].error}</div>`;
        }
        
        // Fetch latest news (general category)
        const latestArticles = await fetchNews('general');
        if (latestArticles.length > 0) {
            latestNews.innerHTML = latestArticles
                .slice(0, 5)
                .map(createNewsItem)
                .join('');
        } else {
            latestNews.innerHTML = `<div class="error">${translations[currentLang].error}</div>`;
        }
    } catch (error) {
        console.error('Error:', error);
        featuredNews.innerHTML = `<div class="error">${translations[currentLang].error}</div>`;
        latestNews.innerHTML = `<div class="error">${translations[currentLang].error}</div>`;
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();
    populateNews();
    updateLanguage();
    initializeReadMode();
});

function updateLanguage() {
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[currentLang]?.[key]) {
            if (element.tagName === 'INPUT') {
                element.placeholder = translations[currentLang][key];
            } else {
                element.textContent = translations[currentLang][key];
            }
        }
    });
}

function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message success';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
}

function showErrorMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message error';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
}

// Reading Mode Toggle
function initializeReadMode() {
    const readModeToggle = document.createElement('button');
    readModeToggle.className = 'read-mode-toggle';
    readModeToggle.innerHTML = `
        <i class="fas fa-book-reader"></i>
        <span>Reading Mode</span>
    `;
    
    const navItems = document.querySelector('.nav-items');
    navItems.appendChild(readModeToggle);

    // Check if reading mode was previously enabled
    const isReadMode = localStorage.getItem('readMode') === 'true';
    if (isReadMode) {
        document.body.classList.add('read-mode');
    }

    readModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('read-mode');
        const isEnabled = document.body.classList.contains('read-mode');
        localStorage.setItem('readMode', isEnabled);
    });
}
