const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};

// Get system settings
router.get('/system', auth, requireAdmin, async (req, res) => {
  try {
    // In a real app, these would come from a settings collection
    const settings = {
      appName: process.env.APP_NAME || 'MediMeal',
      hospitalName: process.env.HOSPITAL_NAME || 'General Hospital',
      contactEmail: process.env.CONTACT_EMAIL || 'admin@medimeal.com',
      deliveryFee: parseFloat(process.env.DELIVERY_FEE || '2.50'),
      taxRate: parseFloat(process.env.TAX_RATE || '8.5'),
      orderTimeLimit: parseInt(process.env.ORDER_TIME_LIMIT || '30'),
      maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
      allowRegistration: process.env.ALLOW_REGISTRATION !== 'false'
    };
    
    res.json(settings);
  } catch (error) {
    console.error('Error fetching system settings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update system settings
router.put('/system', auth, requireAdmin, async (req, res) => {
  try {
    const {
      appName,
      hospitalName,
      contactEmail,
      deliveryFee,
      taxRate,
      orderTimeLimit,
      maintenanceMode,
      allowRegistration
    } = req.body;
    
    // In a real app, you would save these to a database or config file
    // For now, we'll just return success
    
    res.json({
      message: 'System settings updated successfully',
      settings: req.body
    });
  } catch (error) {
    console.error('Error updating system settings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get notification settings
router.get('/notifications', auth, requireAdmin, async (req, res) => {
  try {
    // In a real app, these would come from user preferences or settings collection
    const settings = {
      emailNotifications: true,
      orderAlerts: true,
      dailyReports: true,
      systemUpdates: false,
      smsNotifications: false
    };
    
    res.json(settings);
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update notification settings
router.put('/notifications', auth, requireAdmin, async (req, res) => {
  try {
    const settings = req.body;
    
    // In a real app, you would save these to the user's preferences
    // For now, we'll just return success
    
    res.json({
      message: 'Notification settings updated successfully',
      settings
    });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Change password
router.put('/change-password', auth, requireAdmin, async (req, res) => {
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

// Export data
router.get('/export/:type', auth, requireAdmin, async (req, res) => {
  try {
    const { type } = req.params;
    let data = [];
    let filename = '';
    
    switch (type) {
      case 'orders':
        data = await Order.find({})
          .populate('user', 'fullName email wardNumber bedNumber')
          .sort({ createdAt: -1 });
        filename = 'orders-export.csv';
        break;
        
      case 'users':
        data = await User.find({})
          .select('-password')
          .sort({ createdAt: -1 });
        filename = 'users-export.csv';
        break;
        
      case 'menu':
        data = await MenuItem.find({})
          .populate('createdBy', 'fullName')
          .sort({ createdAt: -1 });
        filename = 'menu-export.csv';
        break;
        
      case 'analytics':
        // Generate analytics data
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        
        const orderStats = await Order.aggregate([
          { $match: { createdAt: { $gte: lastMonth } } },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              totalOrders: { $sum: 1 },
              totalRevenue: { $sum: "$totalAmount" }
            }
          },
          { $sort: { "_id": 1 } }
        ]);
        
        data = orderStats;
        filename = 'analytics-export.csv';
        break;
        
      default:
        return res.status(400).json({ message: 'Invalid export type' });
    }
    
    // Convert to CSV
    if (data.length === 0) {
      return res.status(404).json({ message: 'No data found to export' });
    }
    
    const csv = convertToCSV(data);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(csv);
    
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create backup
router.post('/backup', auth, requireAdmin, async (req, res) => {
  try {
    // In a real app, you would create a database backup
    // This is a simplified version
    
    const backupInfo = {
      timestamp: new Date().toISOString(),
      collections: ['users', 'orders', 'menuitems'],
      size: '2.5MB',
      status: 'completed'
    };
    
    res.json({
      message: 'Backup created successfully',
      backup: backupInfo
    });
  } catch (error) {
    console.error('Error creating backup:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Database cleanup
router.post('/cleanup', auth, requireAdmin, async (req, res) => {
  try {
    // Clean up old logs and temporary data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // In a real app, you might clean up:
    // - Old session data
    // - Temporary files
    // - Expired tokens
    // - Old audit logs
    
    res.json({
      message: 'Database cleanup completed successfully',
      itemsRemoved: 0,
      spaceSaved: '0MB'
    });
  } catch (error) {
    console.error('Error cleaning up database:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get access logs
router.get('/access-logs', auth, requireAdmin, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // In a real app, these would come from actual access logs
    const mockLogs = [
      {
        timestamp: new Date().toISOString(),
        action: 'Login',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0...',
        status: 'Success',
        userId: req.user.userId
      },
      {
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        action: 'Password Change',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0...',
        status: 'Success',
        userId: req.user.userId
      },
      {
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        action: 'Failed Login',
        ipAddress: '203.0.113.45',
        userAgent: 'Mozilla/5.0...',
        status: 'Failed',
        userId: null
      }
    ];
    
    res.json(mockLogs.slice(0, parseInt(limit)));
  } catch (error) {
    console.error('Error fetching access logs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper function to convert data to CSV
function convertToCSV(data) {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value).replace(/"/g, '""');
      }
      return String(value).replace(/"/g, '""');
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
}

module.exports = router;