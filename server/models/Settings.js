const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['system', 'notifications', 'appearance', 'security']
  },
  key: {
    type: String,
    required: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  description: {
    type: String
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Compound index for category and key
settingsSchema.index({ category: 1, key: 1 }, { unique: true });

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;