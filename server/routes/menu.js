const express = require('express');
const router = express.Router();

// Get all menu items
router.get('/', (req, res) => {
  try {
    // Mock data for now
    const menuItems = [
      {
        id: '1',
        name: 'Vegetable Soup',
        description: 'Fresh vegetable soup with herbs',
        price: 5.99,
        category: 'Soups',
        available: true
      },
      {
        id: '2',
        name: 'Grilled Chicken',
        description: 'Herb-seasoned grilled chicken breast',
        price: 12.99,
        category: 'Main Course',
        available: true
      }
    ];
    
    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add menu item (admin only)
router.post('/', (req, res) => {
  try {
    // This would normally save to database
    res.status(201).json({ message: 'Menu item created successfully' });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
