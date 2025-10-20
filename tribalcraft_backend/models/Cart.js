const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  craftId: {
    type: String,
    required: true
  },
  craftTitle: {
    type: String,
    required: true
  },
  craftPrice: {
    type: String,
    required: true
  },
  craftImage: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);

