const express = require('express');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user's orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('items.menuItem')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user.userId 
    }).populate('items.menuItem');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new order
router.post('/', auth, async (req, res) => {
  try {
    console.log('Creating order with data:', req.body);
    console.log('User from auth:', req.user);
    
    const { 
      items, 
      totalAmount, 
      deliveryDetails, 
      paymentDetails 
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ message: 'Invalid total amount' });
    }

    if (!deliveryDetails || !deliveryDetails.deliveryTime) {
      return res.status(400).json({ message: 'Delivery details are required' });
    }

    if (!paymentDetails || !paymentDetails.method) {
      return res.status(400).json({ message: 'Payment details are required' });
    }

    // Create the order
    const order = new Order({
      user: req.user.userId,
      items,
      totalAmount,
      deliveryDetails,
      paymentDetails,
      status: 'pending'
    });

    // Save the order
    const savedOrder = await order.save();

    // Populate the menuItem references
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('items.menuItem')
      .populate('user', 'fullName email wardNumber bedNumber');

    console.log('Order created successfully:', populatedOrder);

    res.status(201).json({
      message: 'Order created successfully',
      order: populatedOrder
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});// Update order status (admin only)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    
    const { status } = req.body;
    const validStatuses = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.status = status;
    await order.save();
    
    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel order (user can cancel if status is pending)
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user.userId 
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
    }
    
    order.status = 'cancelled';
    
    // If payment was completed, handle refund
    if (order.paymentDetails.status === 'completed') {
      if (order.paymentDetails.method === 'card') {
        // In a real app, you would process refund here
        order.paymentDetails.status = 'refunded';
        order.paymentDetails.transactionId = `REFUND-${Date.now()}`;
      } else if (order.paymentDetails.method === 'hospital-account') {
        // Credit back to hospital account
        order.paymentDetails.status = 'refunded';
      }
    }
    
    await order.save();
    
    res.json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get order statistics (admin only)
router.get('/admin/stats', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const stats = await Order.aggregate([
      {
        $facet: {
          totalOrders: [{ $count: "count" }],
          todayOrders: [
            { $match: { createdAt: { $gte: today } } },
            { $count: "count" }
          ],
          statusCounts: [
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ],
          totalRevenue: [
            { $match: { "paymentDetails.status": "completed" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
          ]
        }
      }
    ]);
    
    res.json(stats[0]);
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
