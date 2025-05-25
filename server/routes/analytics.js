const express = require('express');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const auth = require('../middleware/auth');
const PDFDocument = require('pdfkit');
const router = express.Router();

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};

// Get sales analytics
router.get('/sales', auth, requireAdmin, async (req, res) => {
  try {
    const { period = '7d', startDate, endDate } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    } else {
      switch (period) {
        case '24h':
          dateFilter.createdAt = { $gte: new Date(now - 24 * 60 * 60 * 1000) };
          break;
        case '7d':
          dateFilter.createdAt = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
          break;
        case '30d':
          dateFilter.createdAt = { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) };
          break;
        case '90d':
          dateFilter.createdAt = { $gte: new Date(now - 90 * 24 * 60 * 60 * 1000) };
          break;
      }
    }

    const salesData = await Order.aggregate([
      { $match: { ...dateFilter, "paymentDetails.status": "completed" } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          totalRevenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
          avgOrderValue: { $avg: "$totalAmount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const totalStats = await Order.aggregate([
      { $match: { ...dateFilter, "paymentDetails.status": "completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: "$totalAmount" }
        }
      }
    ]);

    res.json({
      salesData: salesData.map(item => ({
        date: item._id,
        revenue: item.totalRevenue,
        orders: item.orderCount,
        avgOrderValue: item.avgOrderValue
      })),
      summary: totalStats[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 }
    });
  } catch (error) {
    console.error('Error fetching sales analytics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get menu performance analytics
router.get('/menu-performance', auth, requireAdmin, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case '7d':
        dateFilter.createdAt = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
        break;
      case '30d':
        dateFilter.createdAt = { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) };
        break;
      case '90d':
        dateFilter.createdAt = { $gte: new Date(now - 90 * 24 * 60 * 60 * 1000) };
        break;
    }

    const menuPerformance = await Order.aggregate([
      { $match: dateFilter },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.menuItem",
          name: { $first: "$items.name" },
          category: { $first: "$items.category" },
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalQuantity: -1 } }
    ]);

    const categoryPerformance = await Order.aggregate([
      { $match: dateFilter },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.category",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json({
      topItems: menuPerformance.slice(0, 10).map(item => ({
        id: item._id,
        name: item.name,
        category: item.category,
        quantity: item.totalQuantity,
        revenue: item.totalRevenue,
        orders: item.orderCount
      })),
      categoryPerformance: categoryPerformance.map(cat => ({
        category: cat._id,
        quantity: cat.totalQuantity,
        revenue: cat.totalRevenue,
        orders: cat.orderCount
      }))
    });
  } catch (error) {
    console.error('Error fetching menu performance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get customer analytics
router.get('/customers', auth, requireAdmin, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case '7d':
        dateFilter.createdAt = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
        break;
      case '30d':
        dateFilter.createdAt = { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) };
        break;
      case '90d':
        dateFilter.createdAt = { $gte: new Date(now - 90 * 24 * 60 * 60 * 1000) };
        break;
    }

    const customerStats = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$user",
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
          avgOrderValue: { $avg: "$totalAmount" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },
      { $sort: { totalSpent: -1 } }
    ]);

    const wardAnalytics = await Order.aggregate([
      { $match: dateFilter },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },
      {
        $group: {
          _id: "$userInfo.wardNumber",
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { totalOrders: -1 } }
    ]);

    res.json({
      topCustomers: customerStats.slice(0, 10).map(customer => ({
        id: customer._id,
        name: customer.userInfo.fullName,
        email: customer.userInfo.email,
        ward: customer.userInfo.wardNumber,
        bed: customer.userInfo.bedNumber,
        totalOrders: customer.totalOrders,
        totalSpent: customer.totalSpent,
        avgOrderValue: customer.avgOrderValue
      })),
      wardAnalytics: wardAnalytics.map(ward => ({
        ward: ward._id,
        orders: ward.totalOrders,
        revenue: ward.totalRevenue
      }))
    });
  } catch (error) {
    console.error('Error fetching customer analytics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get order analytics
router.get('/orders', auth, requireAdmin, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case '7d':
        dateFilter.createdAt = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
        break;
      case '30d':
        dateFilter.createdAt = { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) };
        break;
      case '90d':
        dateFilter.createdAt = { $gte: new Date(now - 90 * 24 * 60 * 60 * 1000) };
        break;
    }

    const statusAnalytics = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const hourlyAnalytics = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { $hour: "$createdAt" },
          orderCount: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const paymentMethodAnalytics = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$paymentDetails.method",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" }
        }
      }
    ]);

    res.json({
      statusBreakdown: statusAnalytics.map(status => ({
        status: status._id,
        count: status.count
      })),
      hourlyTrends: hourlyAnalytics.map(hour => ({
        hour: hour._id,
        orders: hour.orderCount,
        revenue: hour.totalRevenue
      })),
      paymentMethods: paymentMethodAnalytics.map(method => ({
        method: method._id,
        count: method.count,
        amount: method.totalAmount
      }))
    });
  } catch (error) {
    console.error('Error fetching order analytics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Generate comprehensive report
router.get('/report', auth, requireAdmin, async (req, res) => {
  try {
    const { format = 'json', startDate, endDate, period = '30d' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    } else {
      switch (period) {
        case '7d':
          dateFilter.createdAt = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
          break;
        case '30d':
          dateFilter.createdAt = { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) };
          break;
        case '90d':
          dateFilter.createdAt = { $gte: new Date(now - 90 * 24 * 60 * 60 * 1000) };
          break;
      }
    }

    // Fetch all analytics data
    const [salesStats, menuStats, orderStats, userStats] = await Promise.all([
      // Sales stats
      Order.aggregate([
        { $match: { ...dateFilter, "paymentDetails.status": "completed" } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
            totalOrders: { $sum: 1 },
            avgOrderValue: { $avg: "$totalAmount" }
          }
        }
      ]),
      
      // Menu stats
      Order.aggregate([
        { $match: dateFilter },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.name",
            category: { $first: "$items.category" },
            totalQuantity: { $sum: "$items.quantity" },
            totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
          }
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 10 }
      ]),
      
      // Order stats
      Order.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]),
      
      // User stats
      User.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const reportData = {
      reportGenerated: new Date().toISOString(),
      period: period,
      dateRange: {
        start: startDate || (period === '7d' ? new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString() : 
               period === '30d' ? new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString() :
               new Date(now - 90 * 24 * 60 * 60 * 1000).toISOString()),
        end: endDate || now.toISOString()
      },
      summary: {
        totalRevenue: salesStats[0]?.totalRevenue || 0,
        totalOrders: salesStats[0]?.totalOrders || 0,
        averageOrderValue: salesStats[0]?.avgOrderValue || 0,
        totalMenuItems: await MenuItem.countDocuments(),
        totalUsers: await User.countDocuments({ role: { $in: ['user', 'patient'] } })
      },
      topMenuItems: menuStats,
      orderStatusBreakdown: orderStats,
      userRoleBreakdown: userStats
    };

    if (format === 'pdf') {
      // Generate PDF report
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=medimeal-report-${Date.now()}.pdf`);
      
      doc.pipe(res);
      
      // PDF content
      doc.fontSize(20).text('MediMeal Analytics Report', 50, 50);
      doc.fontSize(12).text(`Generated: ${new Date().toLocaleDateString()}`, 50, 80);
      doc.text(`Period: ${period}`, 50, 100);
      
      doc.fontSize(16).text('Summary', 50, 140);
      doc.fontSize(12);
      doc.text(`Total Revenue: $${reportData.summary.totalRevenue.toFixed(2)}`, 50, 170);
      doc.text(`Total Orders: ${reportData.summary.totalOrders}`, 50, 190);
      doc.text(`Average Order Value: $${reportData.summary.averageOrderValue.toFixed(2)}`, 50, 210);
      doc.text(`Total Menu Items: ${reportData.summary.totalMenuItems}`, 50, 230);
      doc.text(`Total Users: ${reportData.summary.totalUsers}`, 50, 250);
      
      doc.fontSize(16).text('Top Menu Items', 50, 290);
      let yPos = 320;
      reportData.topMenuItems.forEach((item, index) => {
        doc.fontSize(12).text(`${index + 1}. ${item._id} - Qty: ${item.totalQuantity}, Revenue: $${item.totalRevenue.toFixed(2)}`, 50, yPos);
        yPos += 20;
      });
      
      doc.end();
    } else {
      res.json(reportData);
    }
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;