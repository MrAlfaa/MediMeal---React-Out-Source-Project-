const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};

// Get all users for admin
router.get('/', auth, requireAdmin, async (req, res) => {
  try {
    const { role, limit = 50, page = 1, search } = req.query;
    
    let query = {};
    if (role && role !== 'all') {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { patientId: { $regex: search, $options: 'i' } },
        { wardNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const totalUsers = await User.countDocuments(query);
    
    res.json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user statistics for admin dashboard
router.get('/stats', auth, requireAdmin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const stats = await User.aggregate([
      {
        $facet: {
          totalUsers: [{ $count: "count" }],
          activeUsers: [
            { $match: { isActive: true } },
            { $count: "count" }
          ],
          newUsersToday: [
            { $match: { createdAt: { $gte: today, $lt: tomorrow } } },
            { $count: "count" }
          ],
          usersByRole: [
            { $group: { _id: "$role", count: { $sum: 1 } } }
          ]
        }
      }
    ]);
    
    const result = stats[0];
    
    res.json({
      totalUsers: result.totalUsers[0]?.count || 0,
      activeUsers: result.activeUsers[0]?.count || 0,
      newUsersToday: result.newUsersToday[0]?.count || 0,
      usersByRole: result.usersByRole
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single user
router.get('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new user
router.post('/', auth, requireAdmin, async (req, res) => {
  try {
    const { fullName, email, password, role, wardNumber, bedNumber, patientId, contactNumber, dietaryRestrictions } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { patientId }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or patient ID' });
    }
    
    const user = new User({
      fullName,
      email,
      password,
      role: role || 'user',
      wardNumber: wardNumber || '',
      bedNumber: bedNumber || '',
      patientId,
      contactNumber: contactNumber || '',
      dietaryRestrictions: dietaryRestrictions || []
    });
    
    await user.save();
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      message: 'User created successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user
router.put('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const { fullName, email, role, wardNumber, bedNumber, contactNumber, dietaryRestrictions, isActive } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    // Update fields
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (role) user.role = role;
    if (wardNumber !== undefined) user.wardNumber = wardNumber;
    if (bedNumber !== undefined) user.bedNumber = bedNumber;
    if (contactNumber !== undefined) user.contactNumber = contactNumber;
    if (dietaryRestrictions !== undefined) user.dietaryRestrictions = dietaryRestrictions;
    if (isActive !== undefined) user.isActive = isActive;
    
    await user.save();
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json({
      message: 'User updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent deletion of superadmin
    if (user.role === 'superadmin') {
      return res.status(403).json({ message: 'Cannot delete superadmin account' });
    }
    
    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.userId) {
      return res.status(403).json({ message: 'Cannot delete your own account' });
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle user status (activate/deactivate)
router.patch('/:id/status', auth, requireAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent deactivating superadmin
    if (user.role === 'superadmin' && !isActive) {
      return res.status(403).json({ message: 'Cannot deactivate superadmin account' });
    }
    
    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user.userId && !isActive) {
      return res.status(403).json({ message: 'Cannot deactivate your own account' });
    }
    
    user.isActive = isActive;
    await user.save();
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: userResponse
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;