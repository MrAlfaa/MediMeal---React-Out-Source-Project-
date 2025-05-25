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

    // Generate order number
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const orderNumber = `ORD-${timestamp.slice(-6)}-${random}`;

    // Create the order object
    const orderData = {
      user: req.user.userId,
      items: items.map(item => ({
        menuItem: item.menuItem || item._id,
        name: item.name,
        description: item.description,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
        category: item.category,
        nutritionalInfo: item.nutritionalInfo || {},
        allergens: item.allergens || []
      })),
      totalAmount,
      deliveryDetails: {
        wardNumber: deliveryDetails.wardNumber,
        bedNumber: deliveryDetails.bedNumber,
        deliveryTime: new Date(deliveryDetails.deliveryTime),
        specialInstructions: deliveryDetails.specialInstructions || ''
      },
      paymentDetails: {
        method: paymentDetails.method,
        status: paymentDetails.method === 'cash' ? 'pending' : 'processing',
        subtotal: paymentDetails.subtotal || totalAmount,
        deliveryFee: paymentDetails.deliveryFee || 0,
        tax: paymentDetails.tax || 0,
        totalPaid: paymentDetails.totalPaid || totalAmount,
        ...(paymentDetails.cardDetails && { cardDetails: paymentDetails.cardDetails }),
        ...(paymentDetails.hospitalAccountId && { hospitalAccountId: paymentDetails.hospitalAccountId })
      },
      orderNumber, // Explicitly set the order number
      status: 'pending'
    };

    console.log('Final order data:', orderData);

    // Create and save the order
    const order = new Order(orderData);
    const savedOrder = await order.save();

    console.log('Order saved successfully:', savedOrder._id);

    // Populate the order with user details for response
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('user', 'fullName email wardNumber bedNumber')
      .populate('items.menuItem', 'name price category');

    res.status(201).json({
      message: 'Order created successfully',
      order: populatedOrder
    });

  } catch (error) {
    console.error('Error creating order:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors,
        details: error.errors
      });
    }
    
    res.status(500).json({ 
      message: 'Server error while creating order', 
      error: error.message 
    });
  }
});
// Update order status (admin only)
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
