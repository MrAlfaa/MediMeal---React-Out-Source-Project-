const mongoose = require('mongoose');

const userPreferencesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  notifications: {
    type: Boolean,
    default: true
  },
  mealReminders: {
    type: Boolean,
    default: true
  },
  emailUpdates: {
    type: Boolean,
    default: false
  },
  preferredMealTimes: {
    breakfast: {
      type: String,
      default: '08:00'
    },
    lunch: {
      type: String,
      default: '12:00'
    },
    dinner: {
      type: String,
      default: '18:00'
    }
  },
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'es', 'fr', 'de']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserPreferences', userPreferencesSchema);