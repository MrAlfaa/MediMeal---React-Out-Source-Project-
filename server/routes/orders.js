const express = require('express');
const router = express.Router();

// Get all orders
router.get('/', (req, res) => {
  try {
    // Mock data for now
    const orders = [
      {
        id: '1',
        userId: 'user123',
        items: [
          { name: 'Vegetable Soup', quantity: 1, price: 5.99 }
        ],
        total: 5.99,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    ];
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new order
router.post('/', (req, res) => {
  try {
    // This would normally save to database
    res.status(201).json({ message: 'Order created successfully' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
