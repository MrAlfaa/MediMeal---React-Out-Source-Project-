const express = require('express');
const MenuItem = require('../models/MenuItem');
const auth = require('../middleware/auth');
const { upload, cloudinary } = require('../config/cloudinary');
const router = express.Router();

// Get all menu items (public route)
router.get('/', async (req, res) => {
  try {
    const { category, search, available } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (available !== undefined) {
      query.isAvailable = available === 'true';
    }

    const menuItems = await MenuItem.find(query)
      .populate('createdBy', 'fullName')
      .sort({ createdAt: -1 });

    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single menu item
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id)
      .populate('createdBy', 'fullName');
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(menuItem);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add menu item (admin only)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const {
      name,
      description,
      price,
      category,
      tags,
      nutritionalInfo,
      allergens,
      dietaryInfo
    } = req.body;

    // Parse JSON strings
    const parsedTags = tags ? JSON.parse(tags) : [];
    const parsedNutritionalInfo = nutritionalInfo ? JSON.parse(nutritionalInfo) : {};
    const parsedAllergens = allergens ? JSON.parse(allergens) : [];
    const parsedDietaryInfo = dietaryInfo ? JSON.parse(dietaryInfo) : {};

    const menuItemData = {
      name,
      description,
      price: parseFloat(price),
      category,
      tags: parsedTags,
      nutritionalInfo: parsedNutritionalInfo,
      allergens: parsedAllergens,
      dietaryInfo: parsedDietaryInfo,
      createdBy: req.user.userId
    };

    // Add image URL if uploaded
    if (req.file) {
      menuItemData.image = req.file.path;
    }

    const menuItem = new MenuItem(menuItemData);
    await menuItem.save();

    const populatedMenuItem = await MenuItem.findById(menuItem._id)
      .populate('createdBy', 'fullName');

    res.status(201).json({
      message: 'Menu item created successfully',
      menuItem: populatedMenuItem
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update menu item (admin only)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const {
      name,
      description,
      price,
      category,
      tags,
      nutritionalInfo,
      allergens,
      dietaryInfo,
      isAvailable
    } = req.body;

    // Parse JSON strings if they exist
    const parsedTags = tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : menuItem.tags;
    const parsedNutritionalInfo = nutritionalInfo ? (typeof nutritionalInfo === 'string' ? JSON.parse(nutritionalInfo) : nutritionalInfo) : menuItem.nutritionalInfo;
    const parsedAllergens = allergens ? (typeof allergens === 'string' ? JSON.parse(allergens) : allergens) : menuItem.allergens;
    const parsedDietaryInfo = dietaryInfo ? (typeof dietaryInfo === 'string' ? JSON.parse(dietaryInfo) : dietaryInfo) : menuItem.dietaryInfo;

    // Update fields
    menuItem.name = name || menuItem.name;
    menuItem.description = description || menuItem.description;
    menuItem.price = price ? parseFloat(price) : menuItem.price;
    menuItem.category = category || menuItem.category;
    menuItem.tags = parsedTags;
    menuItem.nutritionalInfo = parsedNutritionalInfo;
    menuItem.allergens = parsedAllergens;
    menuItem.dietaryInfo = parsedDietaryInfo;
    menuItem.isAvailable = isAvailable !== undefined ? isAvailable === 'true' : menuItem.isAvailable;

    // Update image if uploaded
    if (req.file) {
      // Delete old image from Cloudinary if it exists and is not default
      if (menuItem.image && menuItem.image.includes('cloudinary')) {
        const publicId = menuItem.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`medimeal-menu/${publicId}`);
      }
      menuItem.image = req.file.path;
    }

    await menuItem.save();

    const populatedMenuItem = await MenuItem.findById(menuItem._id)
      .populate('createdBy', 'fullName');

    res.json({
      message: 'Menu item updated successfully',
      menuItem: populatedMenuItem
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete menu item (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Delete image from Cloudinary if it exists and is not default
    if (menuItem.image && menuItem.image.includes('cloudinary')) {
      const publicId = menuItem.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`medimeal-menu/${publicId}`);
    }

    await MenuItem.findByIdAndDelete(req.params.id);

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get menu categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await MenuItem.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
