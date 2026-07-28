const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const errorHandler = require('./common/middleware/errorHandler');
const notFound = require('./common/middleware/notFound');

const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const transactionRoutes = require('./modules/transactions/transaction.routes');
const budgetRoutes = require('./modules/budgets/budget.routes');
const billRoutes = require('./modules/bills/bill.routes');
const goalRoutes = require('./modules/goals/goal.routes');
const splitRoutes = require('./modules/splits/split.routes');

const app = express();

// 1. CORS - MUST BE FIRST to handle preflights
app.use(cors({
  origin: env.frontendUrl,
  credentials: true,
  optionsSuccessStatus: 200
}));

// 2. Body Parser - Must be BEFORE sanitization
app.use(express.json({ limit: '10kb' }));

// 3. Express 5 Compatibility Workaround for req.query
app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    value: { ...req.query },
    writable: true
  });
  next();
});

// 4. Security Middleware
app.use(helmet());
app.use(mongoSanitize());

if (env.nodeEnv !== 'production') {
  app.use(morgan('dev'));
}

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/auth', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/splits', splitRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Finma Finance API',
    version: '2.0.0',
    documentation: 'This is the backend API. Please visit the frontend application to interact with the platform.'
  });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
