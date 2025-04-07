const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages']
  },
  image: {
    type: String,
    default: 'default-food.jpg'
  },
  dietaryInfo: {
    isVegetarian: {
      type: Boolean,
      default: false
    },
    isVegan: {
      type: Boolean,
      default: false
    },
    isGlutenFree: {
      type: Boolean,
      default: false
    },
    isDairyFree: {
      type: Boolean,
      default: false
    },
    isNutFree: {
      type: Boolean,
      default: false
    }
  },
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    sodium: Number
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
