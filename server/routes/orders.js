const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Sample orders (in a real app, this would be stored in a database)
let orders = [];

// Get all orders for the current user
router.get('/', auth, (req, res) => {
  const userOrders = orders.filter(order => order.userId === req.user.userId);
  res.json(userOrders);
});

// Create a new order
router.post('/', auth, (req, res) => {
  const { items, totalAmount, deliveryTime, specialInstructions } = req.body;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order must include at least one item' });
  }
  
  const newOrder = {
    id: Date.now().toString(),
    userId: req.user.userId,
    items,
    totalAmount,
    status: 'pending',
    deliveryTime,
    specialInstructions,
    createdAt: new Date()
  };
  
  orders.push(newOrder);
  
  res.status(201).json(newOrder);
});

// Get order by ID
router.get('/:id', auth, (req, res) => {
  const order = orders.find(o => o.id === req.params.id && o.userId === req.user.userId);
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  res.json(order);
});

// Cancel order
router.put('/:id/cancel', auth, (req, res) => {
  const orderIndex = orders.findIndex(o => o.id === req.params.id && o.userId === req.user.userId);
  
  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  if (orders[orderIndex].status !== 'pending') {
    return res.status(400).json({ message: 'Only pending orders can be cancelled' });
  }
  
  orders[orderIndex].status = 'cancelled';
  
  res.json(orders[orderIndex]);
});

module.exports = router;
