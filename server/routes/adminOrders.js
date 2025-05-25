const express = require('express');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const router = express.Router();

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};

// Get all orders for admin
router.get('/all', auth, requireAdmin, async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const orders = await Order.find(query)
      .populate('user', 'fullName wardNumber bedNumber patientId email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get order statistics for admin dashboard
router.get('/stats', auth, requireAdmin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const stats = await Order.aggregate([
      {
        $facet: {
          totalOrders: [{ $count: "count" }],
          todayOrders: [
            { $match: { createdAt: { $gte: today, $lt: tomorrow } } },
            { $count: "count" }
          ],
          pendingOrders: [
            { $match: { status: 'pending' } },
            { $count: "count" }
          ],
          processingOrders: [
            { $match: { status: { $in: ['accepted', 'processing'] } } },
            { $count: "count" }
          ],
          statusCounts: [
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ],
          todayRevenue: [
            { 
              $match: { 
                createdAt: { $gte: today, $lt: tomorrow },
                "paymentDetails.status": "completed" 
              } 
            },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
          ],
          totalRevenue: [
            { $match: { "paymentDetails.status": "completed" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
          ]
        }
      }
    ]);
    
    const result = stats[0];
    
    res.json({
      totalOrders: result.totalOrders[0]?.count || 0,
      todayOrders: result.todayOrders[0]?.count || 0,
      pendingOrders: result.pendingOrders[0]?.count || 0,
      processingOrders: result.processingOrders[0]?.count || 0,
      statusCounts: result.statusCounts,
      todayRevenue: result.todayRevenue[0]?.total || 0,
      totalRevenue: result.totalRevenue[0]?.total || 0
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status
router.patch('/:id/status', auth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'accepted', 'processing', 'ready', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Validate status transitions
    const validTransitions = {
      'pending': ['accepted', 'cancelled'],
      'accepted': ['processing', 'cancelled'],
      'processing': ['ready', 'cancelled'],
      'ready': ['delivered'],
      'delivered': [],
      'cancelled': []
    };
    
    if (!validTransitions[order.status].includes(status)) {
      return res.status(400).json({ 
        message: `Cannot change status from ${order.status} to ${status}` 
      });
    }
    
    order.status = status;
    order.updatedAt = new Date();
    
    // Update payment status if order is accepted
    if (status === 'accepted' && order.paymentDetails.status === 'pending') {
      order.paymentDetails.status = 'completed';
    }
    
    await order.save();
    
    const updatedOrder = await Order.findById(order._id)
      .populate('user', 'fullName wardNumber bedNumber patientId email');
    
    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;