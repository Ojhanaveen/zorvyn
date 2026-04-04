require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const userRoutes = require('./routes/users');

const app = express();

// 1. CORS - MUST BE FIRST to handle preflights
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 2. Body Parser - Must be BEFORE sanitization
app.use(express.json({ limit: '10kb' })); 

// 3. Express 5 Compatibility Workaround for req.query
app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    value: { ...req.query },
    writable: true,
  });
  next();
});

// 4. Security Middleware
app.use(helmet()); 
app.use(mongoSanitize()); 

app.use(morgan('dev'));

// Rate Limiting for Auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/auth', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);

// Basic health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// We use 5001 as default to avoid macOS AirPlay conflict on 5000
const PORT = 5001;

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('📦 Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
