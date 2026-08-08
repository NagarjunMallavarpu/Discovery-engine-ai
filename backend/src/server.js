const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const searchRoutes = require('./routes/searchRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const { authenticateToken } = require('./middleware/authMiddleware');

// Handle root URL GET /
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'AI Discovery Engine API Server is active',
    status: 'online',
    version: '1.0.0',
    frontend: 'http://localhost:5173',
    health: '/api/health'
  });
});

// Handle Chrome DevTools and browser well-known pings gracefully
app.all('/.well-known/*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({});
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

// API Root status endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'AI Discovery Engine API Server is online',
    version: '1.0.0',
    endpoints: ['/api/products', '/api/categories', '/api/search', '/api/recommendations', '/api/auth', '/api/admin']
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'AI Discovery Engine Backend API',
    timestamp: new Date().toISOString(),
    aiEngine: config.GEMINI_API_KEY ? 'Gemini 2.5 Active' : 'Heuristic Fallback Active'
  });
});

// Authenticate JWT Token for all requests if provided
app.use(authenticateToken);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Fallback 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `API route ${req.originalUrl} not found` });
});

// Error Handling Middleware
app.use(errorHandler);

const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`================================================`);
  console.log(`🚀 AI Discovery Engine API Server running on port ${PORT}`);
  console.log(`📡 Environment: ${config.NODE_ENV}`);
  console.log(`🤖 Gemini AI Engine: ${config.GEMINI_API_KEY ? 'ENABLED' : 'HEURISTIC MODE'}`);
  console.log(`================================================`);
});
