const mongoose = require('mongoose');

const guestCartSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String, default: '' },
  items: [{
    productId: String,
    quantity: Number,
    price: Number,
    productTitle: String
  }],
  lastCartUpdate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('GuestCart', guestCartSchema);
