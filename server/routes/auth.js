const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, wardNumber, bedNumber, patientId, contactNumber, dietaryRestrictions } = req.body;
    
    // Validate input
    if (!fullName || !email || !password || !wardNumber || !bedNumber || !patientId) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { patientId }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or patient ID' });
    }
    
    // Create new user
    const user = new User({
      fullName,
      email,
      password,
      wardNumber,
      bedNumber,
      patientId,
      contactNumber,
      dietaryRestrictions: dietaryRestrictions || []
    });
    
    await user.save();
    
    // Return success message without token
    res.status(201).json({
      message: 'Registration successful! Please login with your credentials.',
      success: true
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error during registration', 
      error: error.message 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        wardNumber: user.wardNumber,
        bedNumber: user.bedNumber,
        patientId: user.patientId,
        contactNumber: user.contactNumber,
        dietaryRestrictions: user.dietaryRestrictions
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
