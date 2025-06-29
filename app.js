const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const helmet = require('helmet');

// route
const searchRoutes = require('./routes/DynamicSearch');
const authRouter = require('./routes/authRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const categoryRoutes = require('./routes/category');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Log requests in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Parse incoming JSON
app.use(express.json());
app.use(cookieParser());

// API routes
app.use('/auth', authRouter);
// Serve static files (optional)
app.use(express.static(path.join(__dirname, 'public')));

app.use(authMiddleware);   // Apply auth middleware to all routes after authentication routes
app.use('/api/categories', categoryRoutes);
app.use('/api/run-bot', searchRoutes);
// 404 handler for unmatched routes
app.use((req, res, next) => {
  next(createError(404, 'Route not found'));
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

module.exports = app;
