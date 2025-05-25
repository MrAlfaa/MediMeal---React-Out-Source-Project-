const express = require('express');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
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

// Get dashboard analytics
router.get('/dashboard', auth, requireAdmin, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    // Order trends
    const orderTrends = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    // Category statistics from menu items
    const categoryStats = await MenuItem.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" }
        }
      }
    ]);

    // Status breakdown
    const statusBreakdown = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Revenue growth calculation
    const currentPeriodRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          "paymentDetails.status": "completed"
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]);

    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - parseInt(days));
    
    const previousPeriodRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousStartDate, $lt: startDate },
          "paymentDetails.status": "completed"
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]);

    // Top menu items
    const topMenuItems = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $unwind: "$items"
      },
      {
        $group: {
          _id: "$items.name",
          orders: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
          category: { $first: "$items.category" }
        }
      },
      {
        $sort: { orders: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // User growth (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    const currentRevenue = currentPeriodRevenue[0]?.total || 0;
    const previousRevenue = previousPeriodRevenue[0]?.total || 0;
    const revenueGrowthPercentage = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

    res.json({
      orderTrends: orderTrends.map(trend => ({
        name: new Date(trend._id).toLocaleDateString('en-US', { weekday: 'short' }),
        value: trend.count,
        date: trend._id,
        revenue: trend.revenue
      })),
      categoryStats: categoryStats.map(cat => ({
        name: cat._id,
        value: cat.count,
        avgPrice: cat.avgPrice
      })),
      statusBreakdown: statusBreakdown.map(status => ({
        name: status._id,
        value: status.count
      })),
      revenueGrowth: {
        current: currentRevenue,
        previous: previousRevenue,
        percentage: revenueGrowthPercentage
      },
      topMenuItems: topMenuItems.map(item => ({
        name: item._id,
        orders: item.orders,
        revenue: item.revenue,
        category: item.category
      })),
      userGrowth: userGrowth.map(growth => ({
        name: new Date(growth._id + '-01').toLocaleDateString('en-US', { month: 'short' }),
        value: growth.count
      }))
    });

  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get revenue analytics
router.get('/revenue', auth, requireAdmin, async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    let startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    const revenueData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          "paymentDetails.status": "completed"
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { 
              format: period === 'year' ? "%Y-%m" : "%Y-%m-%d", 
              date: "$createdAt" 
            }
          },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    res.json(revenueData);
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get menu performance analytics
router.get('/menu-performance', auth, requireAdmin, async (req, res) => {
  try {
    const menuPerformance = await Order.aggregate([
      {
        $unwind: "$items"
      },
      {
        $group: {
          _id: "$items.menuItem",
          name: { $first: "$items.name" },
          category: { $first: "$items.category" },
          totalOrders: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
          avgRating: { $avg: 4.2 } // Mock rating - would come from reviews
        }
      },
      {
        $sort: { totalRevenue: -1 }
      },
      {
        $limit: 20
      }
    ]);

    res.json(menuPerformance);
  } catch (error) {
    console.error('Error fetching menu performance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;