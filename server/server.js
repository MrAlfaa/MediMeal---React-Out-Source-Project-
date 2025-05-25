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
app.use(express.json({ limit: '10mb' })); // Increase limit for image uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Atlas Connection with improved error handling
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('MongoDB Atlas Connection Error:', err);
  });

// Import routes
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const adminOrderRoutes = require('./routes/adminOrders');
const auth = require('./middleware/auth');
const nutritionRoutes = require('./routes/nutrition');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/orders/admin', adminOrderRoutes);
app.use('/api/nutrition', nutritionRoutes);

// Define basic route
app.get('/', (req, res) => {
  res.send('Hospital Food Ordering API is running');
});

// Health check route
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
    database: dbStatus[dbState] || 'unknown',
    timestamp: new Date().toISOString()
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
  console.error('=== Server Error ===');
  console.error('Timestamp:', new Date().toISOString());
  console.error('Request URL:', req.originalUrl);
  console.error('Request Method:', req.method);
  console.error('Request Body:', req.body);
  console.error('Error:', err);
  console.error('Error Stack:', err.stack);
  console.error('==================');
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ 
    message: err.message || 'Something went wrong on the server', 
    error: process.env.NODE_ENV === 'production' ? 'Server error' : err.message
  });
});

// 404 handler for unmatched routes
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
