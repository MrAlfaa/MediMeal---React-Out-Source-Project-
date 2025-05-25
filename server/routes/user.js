const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { fullName, email, contactNumber, dietaryRestrictions } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user.userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    // Create update object with only allowed fields
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (contactNumber !== undefined) updateData.contactNumber = contactNumber;
    if (dietaryRestrictions !== undefined) updateData.dietaryRestrictions = dietaryRestrictions;
    
    // Use findByIdAndUpdate to avoid triggering validation on unchanged fields
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { 
        new: true, 
        runValidators: true,
        select: '-password' // Exclude password from response
      }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user profile statistics
router.get('/profile-stats', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get total orders count
    const totalOrders = await Order.countDocuments({ user: userId });
    
    // Get recent orders for favorite items analysis
    const recentOrders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('items createdAt');
    
    // Calculate favorite items
    const itemFrequency = {};
    recentOrders.forEach(order => {
      order.items.forEach(item => {
        itemFrequency[item.name] = (itemFrequency[item.name] || 0) + item.quantity;
      });
    });
    
    const favoriteItems = Object.entries(itemFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));
    
    // Get last order date
    const lastOrder = await Order.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .select('createdAt');
    
    res.json({
      totalOrders,
      favoriteItems,
      lastOrderDate: lastOrder ? lastOrder.createdAt : null
    });
  } catch (error) {
    console.error('Error fetching profile stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const preferences = req.body;
    
    // In a real app, you might want to store preferences in a separate collection
    // For now, we'll just return success
    res.json({
      message: 'Preferences updated successfully',
      preferences
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Change password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;