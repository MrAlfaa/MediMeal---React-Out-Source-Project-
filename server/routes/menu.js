const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Sample menu data (in a real app, this would come from a database)
const menuItems = [
  {
    id: '1',
    name: 'Vegetable Soup',
    description: 'A hearty vegetable soup with carrots, celery, and potatoes',
    category: 'Soup',
    price: 3.99,
    calories: 120,
    dietaryInfo: ['vegetarian', 'low-sodium'],
    image: 'https://example.com/images/vegetable-soup.jpg'
  },
  {
    id: '2',
    name: 'Grilled Chicken Breast',
    description: 'Tender grilled chicken breast with herbs',
    category: 'Main Course',
    price: 7.99,
    calories: 250,
    dietaryInfo: ['high-protein', 'low-carb'],
    image: 'https://example.com/images/grilled-chicken.jpg'
  },
  {
    id: '3',
    name: 'Steamed Rice',
    description: 'Plain steamed white rice',
    category: 'Side Dish',
    price: 1.99,
    calories: 180,
    dietaryInfo: ['gluten-free', 'vegan'],
    image: 'https://example.com/images/steamed-rice.jpg'
  }
];

// Get all menu items
router.get('/', auth, (req, res) => {
  res.json(menuItems);
});

// Get menu item by ID
router.get('/:id', auth, (req, res) => {
  const menuItem = menuItems.find(item => item.id === req.params.id);
  
  if (!menuItem) {
    return res.status(404).json({ message: 'Menu item not found' });
  }
  
  res.json(menuItem);
});

module.exports = router;
