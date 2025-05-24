const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow both portals
  credentials: true
}));
app.use(express.json());

// MongoDB Atlas Connection with improved error handling
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('MongoDB Atlas Connection Error:', err);
  });

// Import routes
const authRoutes = require('./routes/auth');

// Create menu and orders routes if they don't exist
let menuRoutes, orderRoutes;
try {
  menuRoutes = require('./routes/menu');
} catch (err) {
  // Create a simple router if menu routes don't exist
  menuRoutes = express.Router();
  menuRoutes.get('/', (req, res) => {
    res.json({ message: 'Menu routes working', items: [] });
  });
}

try {
  orderRoutes = require('./routes/orders');
} catch (err) {
  // Create a simple router if order routes don't exist
  orderRoutes = express.Router();
  orderRoutes.get('/', (req, res) => {
    res.json({ message: 'Order routes working', orders: [] });
  });
}

const auth = require('./middleware/auth');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// Define basic route
app.get('/', (req, res) => {
  res.send('Hospital Food Ordering API is running');
});

// Add this route near your other routes
app.get('/api/status', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  
  res.json({
    server: 'running',
    database: dbStatus[dbState] || 'unknown'
  });
});

// Protected route example
app.get('/api/profile', auth, async (req, res) => {
  try {
    const User = require('./models/User');
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  console.error(err.stack);
  
  // Send appropriate error response
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ 
    message: err.message || 'Something went wrong on the server', 
    error: process.env.NODE_ENV === 'production' ? 'Server error' : err.message
  });
});

// 404 handler for unmatched routes - FIXED: Use proper route pattern
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server available at: http://localhost:${PORT}`);
  console.log(`API endpoints: http://localhost:${PORT}/api`);
});
