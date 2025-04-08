const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const customerRoutes = require('./routes/customerRoutes');
const rateLimit = require('express-rate-limit');
const timeout = require('connect-timeout');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set request timeout
const apiTimeout = process.env.API_TIMEOUT || 30000;
app.use(timeout(apiTimeout));
app.use((req, res, next) => {
  if (!req.timedout) next();
});

// Apply rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes by default
  max: process.env.RATE_LIMIT_MAX || 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Routes
app.use('/api/customers', customerRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Customer Service API is running' });
});

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Customer Service running on port ${PORT}`);
});
