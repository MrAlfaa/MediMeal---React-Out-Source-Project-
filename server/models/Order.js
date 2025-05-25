const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true
      },
      category: {
        type: String,
        required: true
      },
      nutritionalInfo: {
        calories: Number,
        protein: Number,
        carbs: Number,
        fat: Number
      },
      allergens: [String]
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryDetails: {
    wardNumber: {
      type: String,
      required: true
    },
    bedNumber: {
      type: String,
      required: true
    },
    deliveryTime: {
      type: Date,
      required: true
    },
    specialInstructions: {
      type: String,
      default: ''
    }
  },
  paymentDetails: {
    method: {
      type: String,
      enum: ['hospital-account', 'cash', 'card'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    transactionId: {
      type: String,
      default: null
    },
    cardDetails: {
      last4: String,
      brand: String,
      expiryMonth: Number,
      expiryYear: Number
    },
    hospitalAccountId: {
      type: String,
      default: null
    },
    subtotal: {
      type: Number,
      required: true
    },
    deliveryFee: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    totalPaid: {
      type: Number,
      required: true
    }
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true,
    default: function() {
      const timestamp = Date.now().toString();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `ORD-${timestamp.slice(-6)}-${random}`;
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
// Generate order number before saving
orderSchema.pre('save', function(next) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `ORD-${timestamp.slice(-6)}-${random}`;
  }
  this.updatedAt = Date.now();
  next();
});
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
